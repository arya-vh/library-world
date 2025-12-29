require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const { MongoClient } = require("mongodb");

// Initialize Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Connect to MongoDB
const client = new MongoClient(process.env.CONNECTION_URL);
const db = client.db("test");
const collection = db.collection("bookslists");

// Semantic Search Function
const getSemanticSearchData = async (req, res) => {
    const { searchQuery } = req.body;
    
    if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Generate embedding for the search query
        let queryEmbedding = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: searchQuery,
        });

        // If the result is a nested array, flatten it
        if (Array.isArray(queryEmbedding[0])) {
            queryEmbedding = queryEmbedding[0];
        }

        // Ensure the embedding is an array of numbers
        if (!Array.isArray(queryEmbedding) || queryEmbedding.some(isNaN)) {
            throw new Error("Invalid embedding response from Hugging Face API");
        }

        // Find similar books using MongoDB vector search
        const result = await collection.aggregate([
            {
                "$vectorSearch": {
                    "queryVector": queryEmbedding,
                    "path": "embedding",
                    "numCandidates": 100,
                    "limit": 10,
                    "index": "vector_index"
                }
            }
        ]).toArray();

        if (result.length > 0) {
            return res.status(200).json({ total: result.length, data: result });
        }

        // If no semantic match, fallback to AI search
        return getAiSearchData(req, res);

    } catch (error) {
        console.error("Semantic Search Error:", error);
        return res.status(500).json({ message: "Error performing search", error: error.message });
    }
};

module.exports = { getSemanticSearchData };
