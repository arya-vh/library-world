import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_server } from "../../main";

const FilterBooksForm = ({ setBookData, setSearchResult, setFilterActive }) => {
  const API_URL_FILTER = `${backend_server}/api/v1/filter`;
  const API_URL_SEMANTIC_SEARCH = `${backend_server}/api/v1/semantic-search`;
  const API_URL_AI_SEARCH = `${backend_server}/api/v1/ai-search`;
  const API_ALLBOOKS_URL = `${backend_server}/api/v1/books`;

  const empty_field = {
    title: "",
    category: "",
    author: "",
    language: "",
  };

  const [filterFields, setFilterFields] = useState(empty_field);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(API_ALLBOOKS_URL);
      const books = response.data.data;

      setCategories([...new Set(books.map((book) => book.category))]);
      setAuthors([...new Set(books.map((book) => book.author))]);
      setLanguages([...new Set(books.map((book) => book.language))]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // **🔹 Handles Search Button Click**
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFilterActive(true);

    const { title, category, author, language } = filterFields;
    const filtersApplied = category || author || language;

    try {
      let response;

      // **Step 1: If filters are applied, use normal filtering**
      if (filtersApplied || title) {
        response = await axios.get(API_URL_FILTER, { params: filterFields });

        if (response.data.total > 0) {
          setBookData(response.data.data);
          setSearchResult(true);
          return;
        }
      }

      // **Step 2: If title is provided, use Semantic Search**
      if (title) {
        response = await axios.post(API_URL_SEMANTIC_SEARCH, { searchQuery: title });

        if (response.data.total > 0) {
          setBookData(response.data.data);
          setSearchResult(true);
          return;
        }
      }

      // **Step 3: If semantic search fails, use AI Search as fallback**
      if (title) {
        response = await axios.post(API_URL_AI_SEARCH, { searchQuery: title });

        if (response.data.total > 0) {
          setBookData(response.data.data);
          setSearchResult(true);
          return;
        }
      }

      // **Step 4: If all searches fail, show no results**
      setBookData([]);
      setSearchResult(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSearchResult(false);
    }
  };

  // **🔹 Handles Input Changes**
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterFields({ ...filterFields, [name]: value });
  };

  const handleClearFilter = async () => {
    setFilterFields(empty_field);
    setSearchResult(true);
    setFilterActive(false);
    setBookData([]);

    try {
      const response = await axios.get(API_ALLBOOKS_URL);
      setBookData(response.data.data);

      const bookCategories = [...new Set(response.data.data.map((book) => book.category))];
      const bookAuthors = [...new Set(response.data.data.map((book) => book.author))];
      const bookLanguages = [...new Set(response.data.data.map((book) => book.language))];

      setCategories(bookCategories);
      setAuthors(bookAuthors);
      setLanguages(bookLanguages);
    } catch (error) {
      console.error("Error fetching books and dropdown data after reset:", error);
    }
  };

  return (
    <div className="container">
      <div className="row my-3 justify-content-center">
        <div className="col-md-10">
          <form method="get" className="d-flex flex-wrap align-items-center">
            
            {/* 🔹 Search Input */}
            <div className="form-group col-lg-4 col-md-6 px-1">
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Search by title, topic..."
                name="title"
                value={filterFields.title}
                maxLength={50}
                onChange={handleInputChange}
              />
            </div>

            {/* 🔹 Category Filter */}
            <div className="form-group col-lg-2 col-md-3 px-1">
              <select className="form-control" value={filterFields.category} name="category" onChange={handleInputChange}>
                <option key="" value="">Categories</option>
                {categories.map((books_category) => (
                  <option key={books_category} value={books_category}>{books_category}</option>
                ))}
              </select>
            </div>

            {/* 🔹 Author Filter */}
            <div className="form-group col-lg-2 col-md-3 px-1">
              <select className="form-control" value={filterFields.author} name="author" onChange={handleInputChange}>
                <option key="" value="">Author</option>
                {authors.map((books_author) => (
                  <option key={books_author} value={books_author}>{books_author}</option>
                ))}
              </select>
            </div>

            {/* 🔹 Language Filter */}
            <div className="form-group col-lg-2 col-md-3 px-1">
              <select className="form-control" value={filterFields.language} name="language" onChange={handleInputChange}>
                <option key="" value="">Language</option>
                {languages.map((books_language) => (
                  <option key={books_language} value={books_language.toUpperCase()}>{books_language.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* 🔹 Search & Clear Buttons */}
            <div className="form-group col-lg-2 col-md-3 d-flex px-1">
              <button type="submit" className="btn btn-success w-50 mx-1" onClick={handleFormSubmit}>
                Search
              </button>
              <button type="button" className="btn btn-danger w-50 mx-1" onClick={handleClearFilter}>
                Clear
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterBooksForm;
