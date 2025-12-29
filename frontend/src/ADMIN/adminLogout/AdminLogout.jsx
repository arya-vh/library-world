import React from 'react';
import { backend_server } from '../../main';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from '../../LoginState';
import { FaSignOutAlt } from 'react-icons/fa'; // Import logout icon
import './AdminLogout.css'; // Import custom CSS for styling

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`;
  const navigate = useNavigate();
  const userLoginState = useLoginState();

  const handleLogout = async () => {
    try {
      localStorage.clear();

      // Clear cookie using API
      const resp = await axios.post(logout_Api_url);
      console.log(resp);

      window.location.href = '/';
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

export default AdminLogout;