import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backend_server } from "../../main";
import "./viewBooks.css";
import useFetch from "../../useFetch";
import RequestBook from "../requestBooks/RequestBook";
import SimilarBooks from "./SimilarBooks";

const ViewBook = () => {
  const { id } = useParams(); //fetching book id from url params
  const API_URL = `${backend_server}/api/v1/books/${id}`;

  const { request_Book } = RequestBook();
  const navigate = useNavigate();
  const getData = useFetch(API_URL);

  // Destructuring fetched data
  const data = getData.fetched_data.data;
  const imageFullPath = getData.imagePath;
  const [bookData, setBookData] = useState({});

  useEffect(() => {
    setBookData({ ...data, image: imageFullPath });
    window.scrollTo(0, 0);
  }, [data]);

  return (
    <div className="container py-5">
      <div className="row shadow-lg p-4 bg-white rounded mb-5">
        {/* Image Section */}
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <img src={bookData.image} alt={bookData.title} className="img-fluid rounded" style={{ maxHeight: '400px' }} />
        </div>

        {/* Details Section */}
        <div className="col-md-7">
          <h2 className="fw-bold">{bookData.title}</h2>
          <p className="text-muted fs-5">by <span className='fw-medium'>{bookData.author}</span></p>
          <h6 className="text-primary">Category: {bookData.category}</h6>
          <h6>Language: {bookData.language}</h6>
          <h6 className={bookData.available ? "text-success" : "text-danger"}>
            {bookData.available ? "In Stock" : "Currently Unavailable"}
          </h6>
          
          <h5 className="mt-3">Synopsis:</h5>
          <p className="text-muted fs-6">{bookData.description}</p>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4">
            {bookData.available ? (
              <button className="btn btn-primary px-4" onClick={() => request_Book(bookData._id)}>
                Request Book
              </button>
            ) : (
              <button className="btn btn-secondary px-4" disabled>
                Currently Unavailable
              </button>
            )}
            <button className="btn btn-outline-dark px-4" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Similar Books */}
      <SimilarBooks />
    </div>
  );
};

export default ViewBook;
