import React from 'react';
import { backend_server } from '../../main';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from '../../LoginState';
import { FaSignOutAlt } from 'react-icons/fa'; // Import logout icon
import './ClientLogout.css'; // Import custom CSS for styling

const ClientLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`;
  const navigate = useNavigate();
  const userLoginState = useLoginState();

  const handleLogout = async () => {
    try {
      // Reset or set user login state to NULL
      userLoginState.logout();

      // Clear cookie using API
      await axios.post(logout_Api_url);

      navigate('/', { replace: true });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className='logout-container'>
      <div className='logout-card'>
        <div className='logout-icon'>
          <FaSignOutAlt />
        </div>
        <h2 className='logout-title'>Are you sure you want to logout?</h2>
        <p className='logout-subtitle'>You can always log back in anytime.</p>
        <div className='logout-buttons'>
          <button className='logout-button logout-button-yes' onClick={handleLogout}>
            Yes, Logout
          </button>
          <button className='logout-button logout-button-no' onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLogout;