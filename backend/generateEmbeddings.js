require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const mongoose = require("mongoose");
const Book = require('./models/bookScheme'); // Ensure correct model import

// Initialize Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Connect to MongoDB using Mongoose
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

// Function to generate embeddings
async function generateEmbeddings() {
    await connectDB(); // Ensure connection before querying

    try {
        // Fetch books that don’t have embeddings yet
        const books = await Book.find({ embedding: { $exists: false } });

        if (books.length === 0) {
            console.log("⚠️ No books found that need embeddings.");
            return;
        }

        for (let book of books) {
            const text = `${book.title} - ${book.description}`;
            console.log(`🔄 Processing: ${book.title}`);

            try {
                const response = await hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2",
                    inputs: text,
                });

                if (!response || !Array.isArray(response)) {
                    console.error(`❌ Failed to get embedding for ${book.title}`);
                    continue;
                }

                // Store embedding in MongoDB using Mongoose
                const result = await Book.updateOne(
                    { _id: book._id },
                    { $set: { embedding: response } }
                );

                // Check update result
                if (result.matchedCount === 0) {
                    console.error(`⚠️ Book ${book.title} not found in MongoDB (ID: ${book._id})`);
                } else if (result.modifiedCount === 0) {
                    console.warn(`⚠️ Embedding already exists for ${book.title}, skipping.`);
                } else {
                    console.log(`✅ Successfully stored embedding for ${book.title}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${book.title}:`, error);
            }
        }

        console.log("✅ All embeddings processed.");
    } catch (err) {
        console.error("❌ Error fetching books:", err);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB Connection Closed.");
    }
}

// Run the function
generateEmbeddings();