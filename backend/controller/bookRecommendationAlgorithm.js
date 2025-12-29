const BooksModel = require('../models/bookScheme');
const BookTransactionModel = require('../models/bookTransaction');

// Utility function to fetch books that the user has borrowed and read
const getUserReadBooks = async (userId) => {
  const userBookDetails = await BookTransactionModel.find({ userId, issueStatus: 'ACCEPTED' });
  const bookIds = userBookDetails.map((obj) => obj.bookId);
  return bookIds;
};

// Function to extract unique preferences (categories, authors, languages)
const extractUserPreferences = async (bookIds) => {
  const queriedBooks = await BooksModel.find({ _id: { $in: bookIds } });
  const categories = [...new Set(queriedBooks.map((book) => book.category))];
  const authors = [...new Set(queriedBooks.map((book) => book.author))];
  const languages = [...new Set(queriedBooks.map((book) => book.language))];

  return { categories, authors, languages, queriedBooks };
};

// Function to get books with the same language but excluding already read ones
const getSimilarLanguageBooks = async (languageArray, excludeBookIds, bookId) => {
  return await BooksModel.find({
    available: true,
    language: { $in: languageArray },
    _id: { $ne: bookId, $nin: excludeBookIds },
  });
};

// Function to filter books by author and category preferences
const filterBooksByPreferences = (books, authorArray, categoryArray, author) => {
  const authorBooks = books.filter((book) => book.author === author);
  const categoryBooks = books.filter((book) => categoryArray.includes(book.category) && book.author !== author);
  return { authorBooks, categoryBooks };
};

// Function to handle final book recommendations
const generateRecommendations = (similarAuthorBooks, similarCategoryBooks, authorArray, languageArray, bookId, excludeBooksId) => {
  let recommendationBooks = [];

  if (similarAuthorBooks.length < 2) {
    recommendationBooks = similarAuthorBooks.concat(similarCategoryBooks).slice(0, 4);

    if (recommendationBooks.length < 4) {
      const remainingBooks = similarCategoryBooks.filter(
        (book) => !recommendationBooks.some((recBook) => recBook._id.equals(book._id)) && !authorArray.includes(book.author)
      );
      recommendationBooks = recommendationBooks.concat(remainingBooks).slice(0, 4);
    }
  } else {
    recommendationBooks = similarAuthorBooks.slice(0, 2).concat(similarCategoryBooks).slice(0, 4);
  }

  return recommendationBooks;
};

// Main function to analyze user preferences and recommend books
const analyzeUserPreferences = async (userId, bookId) => {
  try {
    // Get books user has read
    const userReadBooks = await getUserReadBooks(userId);
    const { categories, authors, languages, queriedBooks } = await extractUserPreferences(userReadBooks);

    // Exclude already read books
    const excludeBooksId = userReadBooks;

    // Fetch the last borrowed book details
    const lastBorrowedBook = await BooksModel.findOne({ _id: bookId });
    const { category, author, language } = lastBorrowedBook;

    // Update the user's preferences with the last borrowed book details
    if (!categories.includes(category)) categories.push(category);
    if (!languages.includes(language)) languages.push(language);
    if (!authors.includes(author)) authors.push(author);

    // Find books that match the user's preferences
    const similarLanguageBooks = await getSimilarLanguageBooks(languages, excludeBooksId, bookId);
    const { authorBooks, categoryBooks } = filterBooksByPreferences(similarLanguageBooks, authors, categories, author);

    // Generate final book recommendations
    const recommendationBooks = generateRecommendations(authorBooks, categoryBooks, authors, languages, bookId, excludeBooksId);

    return recommendationBooks;
  } catch (error) {
    console.error("Error in analyzing user preferences:", error);
    throw new Error("Failed to analyze user preferences");
  }
};

// API Testing the Algorithm
const algoTest = async (req, res) => {
  try {
    const result = await analyzeUserPreferences('649179774afae22ac6166b6e', '64967c201faf3efe0d583f2e');
    
    // Simplify the output for easy testing
    const titlesAndCategories = result.map((book) => ({
      id: book._id,
      title: book.title,
      category: book.category,
      author: book.author,
    }));

    res.status(200).json({
      totalHits: titlesAndCategories.length,
      recommendedBooks: titlesAndCategories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzeUserPreferences, algoTest };
