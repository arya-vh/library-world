import React, { useState, useEffect } from 'react';
import { useLoginState } from '../../LoginState';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { backend_server } from '../../main';
import ClientDashboard from './ClientDashboard';
import ClientDetails from './ClientDetails';
import ClientLogout from '../clientLogout/ClientLogout';
import './clientprofile.css';
import { ClipLoader } from 'react-spinners';

const ClientProfile = () => {
  const userLoginState = useLoginState();
  const getSingleUser_API_URL = `${backend_server}/api/v1/users/`;

  const [userBookData, setUserBookData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.post(getSingleUser_API_URL, {});
      setUserBookData(response.data.bookDataAll || []);
      setUserData(response.data.userData || {});
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className='container-fluid'>
      <Row className='client-sidebar'>
        <Col className='col-md-2 client-dashboard-buttons'>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn btn-primary my-1 mx-1 ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn btn-primary my-1 mx-1 ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            My Details
          </button>
          <button
            onClick={() => setActiveTab('logout')}
            className={`btn btn-primary my-1 mx-1 ${activeTab === 'logout' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            Logout
          </button>
        </Col>

        <Col>
          {loading ? (
            <div className='text-center'>
              <ClipLoader color='#007bff' size={50} />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <ClientDashboard userBookData={userBookData} />}
              {activeTab === 'profile' && <ClientDetails userData={userData} />}
              {activeTab === 'logout' && <ClientLogout />}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ClientProfile;