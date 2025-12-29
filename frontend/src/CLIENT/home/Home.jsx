import React, { useState } from "react";
import "./home.css";

import BannerHome from "../bannerHome/BannerHome";
import FeaturedBooks from "../featuredBooks/FeaturedBooks";
import RecentlyAddedBooks from "../recentlyAddedBooks/RecentlyAddedBooks";
import { Row } from "react-bootstrap";
import RecommendedBooks from "../recommendedBooks/RecommendedBooks";
import Books from "../books/Books";
import HeroSection from "../bannerHome/BannerHome2";
import LibraryHero from "../bannerHome/BannerHome2";
import ChatbotComponent from '../chatbot/Chatbot'

// import FilterBooksForm from '../books/FilterBooksForm'
// import BrowseCollectionBooks from '../books/BrowseCollectionBooks'
const Home = () => {
  //testing gardae ho hae
  // const  [bookData, setBookData] = useState([]);
  // const [searchResult, setSearchResult]=useState(true)
  return (
    <div className="home-main-div">
      <LibraryHero />
      <div className="container">
        <Row className="my-3">
          <RecommendedBooks></RecommendedBooks>
        </Row>
        {/* for testing ok , we need to add filtering and browsing features too right*/}
        <Row>
          <Books />
        </Row>
        {/* upto here */}

        <Row>
          <RecentlyAddedBooks></RecentlyAddedBooks>
        </Row>
        <Row>
          <FeaturedBooks></FeaturedBooks>
        </Row>
        <ChatbotComponent />
      </div>
    </div>
  );
};

export default Home;
