import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomPagination from '../pagination/CustomPagination';
import SmallBanner from '../bannerHome/SmallBanner';
import PopularBooks from './PopularBooks';
import { backend_server } from '../../main';
import BrowseCollectionBooks from './BrowseCollectionBooks';
import { Toaster } from 'react-hot-toast';
import FilterBooksForm from './FilterBooksForm';

const Books = () => {
  const API_URL = `${backend_server}/api/v1/book/`;
  const [bookData, setBookData] = useState([]);
  const [searchResult, setSearchResult] = useState(true);
  const [filterActive, setFilterActive] = useState(false);

  // Fetch paginated data
  const fetchData = async (pageNumber) => {
    try {
      const resp = await axios.get(`${API_URL}?page=${pageNumber}`);
      setBookData(resp.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchData(1); // Fetch initial books
  }, []);

  return (
    <div className='container'>
      <div className='col mt-5'>
        <h1 className='h1' style={{ textAlign: 'center' }}>
          Browse Collections
        </h1>


        {/* Filter Books */}
        <FilterBooksForm
  setBookData={setBookData}
  setSearchResult={setSearchResult}
  setFilterActive={setFilterActive}
/>

        {/* Browse Collection Books */}
        <BrowseCollectionBooks
          bookData={bookData}
          searchResult={searchResult}
        />
        {/* Pagination */}
        {!filterActive && (
          <div className='my-3 d-flex justify-content-center'>
            <CustomPagination fetchData={fetchData} filterActive={filterActive} />
          </div>
        )}
      </div>

      <div className='row'>
        <h1 className='h1 mt-3' style={{ textAlign: 'center' }}>
          Popular Books
        </h1>
        <PopularBooks />
      </div>

      <SmallBanner />
    </div>
  );
};

export default Books;
