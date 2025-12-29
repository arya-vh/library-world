import React, { useState, useEffect } from 'react';
import { backend_server } from '../../main';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';
import { GiBookshelf, GiBookPile } from 'react-icons/gi'; // Import from 'react-icons/gi'
import { BsFillJournalBookmarkFill } from 'react-icons/bs'; // Import from 'react-icons/bs'
import { BiCategoryAlt } from 'react-icons/bi'; // Import from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'; // Import from 'react-icons/fa'
import { FiGitPullRequest } from 'react-icons/fi'; // Import from 'react-icons/fi'
import './adminpanel.css';

const AdminPanel = () => {
  const FetchInfo_API = `${backend_server}/api/v1/adminHomePageInfo`;
  const [homepageData, setHomepageData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(FetchInfo_API);
      setHomepageData(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='adminpanel-container p-7'>
      <h1 className='text-center mb-4'>Admin Dashboard</h1>
      <Row className='g-4'>
        {/* Total Books Card */}
        <Col xs={12} md={6} lg={4}>
        <a href='/admin/managebooks'>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <GiBookshelf className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalBooks}</h3>
                <h5>Total Books</h5>
              </Card.Title>
            </Card.Body>
          </Card>
          </a>
        </Col>

        {/* Issued Books Card */}
        <Col xs={12} md={6} lg={4}>
        <a href='/admin/issuedbooks'>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <GiBookPile className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalIssuedBooks}</h3>
                <h5>Issued Books</h5>
              </Card.Title>
            </Card.Body>
          </Card>
        </a>
        </Col>

        {/* Book Requests Card */}
        <Col xs={12} md={6} lg={4}>
        <a href='/admin/booksrequests'>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <FiGitPullRequest className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalBookRequests}</h3>
                <h5>Book Requests</h5>
              </Card.Title>
            </Card.Body>
          </Card>
          </a>
        </Col>

        {/* Registered Users Card */}
        <Col xs={12} md={6} lg={4}>
        <a href='/admin/viewusers'>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <FaUserFriends className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalRegisteredUsers}</h3>
                <h5>Registered Users</h5>
              </Card.Title>
            </Card.Body>
          </Card>
          </a>
        </Col>

        {/* Authors Listed Card */}
        <Col xs={12} md={6} lg={4}>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <BsFillJournalBookmarkFill className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalAuthors}</h3>
                <h5>Authors Listed</h5>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>

        {/* Categories Listed Card */}
        <Col xs={12} md={6} lg={4}>
          <Card className='card-admin h-100'>
            <Card.Body className='text-center'>
              <BiCategoryAlt className='card-admin-icon mb-3' />
              <Card.Title className='card-admin-title'>
                <h3 className='h3'>{homepageData.totalCategories}</h3>
                <h5>Categories Listed</h5>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanel;