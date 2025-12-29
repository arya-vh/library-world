require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const BookList = require('../models/bookScheme');

// Initialize Hugging Face client
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

// AI Search Logic using Hugging Face API
const getAiSearchData = async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Fetch categories, authors, and languages from DB
    const [allCategories, allAuthors, allLanguages] = await Promise.all([
      BookList.distinct('category'),
      BookList.distinct('author'),
      BookList.distinct('language'),
    ]);

    // AI Prompt
    const prompt = `
      Search query: "${searchQuery}"
      Available categories: ${allCategories.join(', ')}
      Available authors: ${allAuthors.join(', ')}
      Available languages: ${allLanguages.join(', ')}

      Identify the most relevant category, author, or language for the given search query.
      Return a JSON object with:
      { "type": "category" | "author" | "language", "values": ["value1","value2"] }
      If no match is found, return: { "type": null, "values": [] }
    `;

    // Send request to Hugging Face
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      provider: "hf-inference",
      max_tokens: 300,
    });

    // Parse AI response
    console.log("Raw AI Response:", chatCompletion.choices[0].message.content);
    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);

    if (!aiResponse.type || !aiResponse.values.length) {
      return res.status(200).json({ total: 0, data: [] });
    }

    // Query MongoDB for matching books
    const queryObject = { [aiResponse.type]: { $in: aiResponse.values } };
    const result = await BookList.find(queryObject);

    res.status(200).json({ total: result.length, data: result });
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ message: 'Error performing AI search', error: error.message });
  }
};

module.exports = { getAiSearchData };