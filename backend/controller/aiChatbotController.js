require('dotenv').config();
const { HfInference } = require("@huggingface/inference");
const BookList = require('../models/bookScheme');
const { StatusCodes } = require('http-status-codes');
const levenshtein = require('fast-levenshtein');

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

// **System Information**
const SYSTEM_INFO = `📚 **Pustak Prabandha: An Intelligent Library Assistant** ...`;

// **Predefined Responses**
const PREDEFINED_RESPONSES = {
  "hello": "Hello! How can I assist you with the library?",
  "hi": "Hi! How can I assist you with the library?",
  "namaste": "Namaste! How can I assist you with the library?",
  "return policy": "All borrowed books must be returned within **10 days**...",
  "borrow limit": "You can borrow up to **3 books** at a time.",
  "late fees": "Late returns cost **Rs. 10 per day**.",
  "recommendations": "We use a **content-based filtering algorithm**...",
  "issue a book": "First, request a book. If approved, collect it...",
};

// **Check if Query is Library-Related**
const isLibraryRelated = (query) => {
  const keywords = ["book", "library", "borrow", "return", "fine", "recommend", "category", "rules", "request", "pustak prabandha"];
  return keywords.some(keyword => query.includes(keyword));
};

// **Extract Category from User Query**
const extractCategory = (query, categories) => {
  return categories.find(cat => query.includes(cat.toLowerCase())) || null;
};

// **Find Best Fuzzy Match**
const getBestMatch = (message, predefinedKeys) => {
  let bestMatch = null;
  let minDistance = 3; // Allow slight variations

  for (const key of predefinedKeys) {
    const distance = levenshtein.get(message, key);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = key;
    }
  }
  return bestMatch;
};

// **AI Chatbot Controller**
const getAiChatbotResponse = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const lowerMessage = message.toLowerCase();

    // **Step 1: Provide System Information or Predefined Responses via Keyword Matching**
    if (lowerMessage.includes("pustak prabandha") || lowerMessage.includes("library rules")) {
      return res.status(200).json({ reply: SYSTEM_INFO });
    }
    if (PREDEFINED_RESPONSES[lowerMessage]) {
      return res.status(200).json({ reply: PREDEFINED_RESPONSES[lowerMessage] });
    }

    // **Step 2: Handle Book Recommendations Based on Categories**
    const allCategories = await BookList.distinct('category');
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("book about") || lowerMessage.includes("tell me about")) {
      const category = extractCategory(lowerMessage, allCategories);
      if (category) {
        const recommendedBooks = await BookList.find({ category }).limit(5);
        const bookTitles = recommendedBooks.map(book => book.title).join(", ");
        return res.status(200).json({ reply: `📚 Recommended books in ${category}: ${bookTitles}` });
      } else {
        return res.status(200).json({ reply: `I can recommend books from these categories: ${allCategories.join(", ")}. Please specify one.` });
      }
    }

    // **Step 3: Check Predefined Responses with Fuzzy Matching**
    const matchedKey = getBestMatch(lowerMessage, Object.keys(PREDEFINED_RESPONSES));
    if (matchedKey) {
      return res.status(200).json({ reply: PREDEFINED_RESPONSES[matchedKey] });
    }

    // **Step 4: Prevent Off-Topic Queries**
    if (!isLibraryRelated(lowerMessage)) {
      return res.status(200).json({ reply: "I can only assist with Pustak Prabandha library-related queries. Please ask about books, categories, borrowing, or library policies." });
    }

    // **Step 5: Query Hugging Face with Library Context**
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: "You are Pustak Prabandha, a library assistant chatbot. Answer ONLY using the library's rules and policies. Do NOT provide generic answers." },
        { role: "user", content: message }
      ],
      provider: "hf-inference",
      max_tokens: 300,
    });

    const chatbotReply = chatCompletion.choices[0].message.content || "Sorry, I didn't understand that.";
    res.status(200).json({ reply: chatbotReply });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing chatbot request', error: error.message });
  }
};

module.exports = { getAiChatbotResponse };