import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { backend_server } from '../../main';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from '../../LoginState';
import { ClipLoader } from 'react-spinners';

const ClientDetails = ({ userData }) => {
  const UpdateUser_API_URL = `${backend_server}/api/v1/users`;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [inputFieldPassword, setInputFieldPassword] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [inputFieldNormal, setInputFieldNormal] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const handleOnChangeNormal = (e) => {
    setInputFieldNormal({
      ...inputFieldNormal,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangePassword = (e) => {
    setInputFieldPassword({
      ...inputFieldPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, phone } = inputFieldNormal;

    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid Email Format');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(UpdateUser_API_URL, {
        username,
        email,
        phone,
      });

      if (response.data.ENTER_OTP) {
        toast.success(response.data.message);
        userLoginState.logout();
        navigate('/otp', { replace: true });
      } else {
        toast.success('Update Success');
      }
    } catch (error) {
      console.log(error.response);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { confirm_password, new_password, old_password } = inputFieldPassword;

    if (new_password !== confirm_password) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!alphanumericRegex.test(new_password)) {
      toast.error('Password must be alphanumeric and contain at least one special character');
      setLoading(false);
      return;
    }

    try {
      await axios.patch(UpdateUser_API_URL, {
        old_password,
        new_password,
      });
      toast.success('Password Changed Successfully');
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputFieldNormal({ ...userData });
  }, [userData]);

  return (
    <div className='container my-3'>
      <Toaster />
      <Row className='align-items-center'>
        <Col md={4} className='text-center mx-1 my-2'>
          <div className='profile-details border p-4 shadow'>
            <img
              style={{ width: '100px' }}
              className='img-fluid'
              src='/clientprofile.png'
              alt='Profile'
            />
            <h5 className='mt-3'>{userData.username.toUpperCase()}</h5>
          </div>
        </Col>
        <Col md={6}>
          <div className='profile-details border p-4 shadow mx-1 my-2'>
            <h5>Email: {userData.email}</h5>
            <hr />
            <h5>Phone: {userData.phone}</h5>
            <hr />
            <h5>Total Books: {userData.totalAcceptedBooks}</h5>
          </div>
        </Col>
      </Row>

      <Row>
        <div className='profile-buttons text-center'>
          <Button variant='primary' onClick={() => setShowEditModal(true)} className='mx-2 my-3'>
            Edit Profile
          </Button>
          <Button variant='secondary' onClick={() => setShowChangePasswordModal(true)} className='mx-2 my-3'>
            Change Password
          </Button>
        </div>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group controlId='username'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                minLength={5}
                placeholder='Enter username'
                name='username'
                onChange={handleOnChangeNormal}
                value={inputFieldNormal.username}
                required
                autoComplete='off'
              />
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                autoComplete='off'
                placeholder='Enter email'
                name='email'
                value={inputFieldNormal.email}
                onChange={handleOnChangeNormal}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId='phone'>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='text'
                required
                placeholder='Enter phone number'
                name='phone'
                value={inputFieldNormal.phone}
                onChange={handleOnChangeNormal}
                pattern='9\d{9}'
                minLength='10'
                maxLength='10'
              />
            </Form.Group>
            <Form.Group className='text-center my-2'>
              <button type='submit' className='btn btn-success' disabled={loading}>
                {loading ? <ClipLoader size={20} color='#fff' /> : 'Update'}
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePassword}>
            <Form.Group controlId='old_password'>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type='password'
                minLength={5}
                required
                placeholder='Enter old password'
                name='old_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.old_password}
              />
            </Form.Group>
            <Form.Group controlId='new_password'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                required
                minLength={5}
                type='password'
                placeholder='Enter new password'
                name='new_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.new_password}
              />
            </Form.Group>
            <Form.Group controlId='confirm_password'>
              <Form.Label>Confirm Password</Form.Label>
              <div className='password-field'>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={5}
                  placeholder='Re-enter new Password'
                  name='confirm_password'
                  onChange={handleOnChangePassword}
                  value={inputFieldPassword.confirm_password}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              </div>
            </Form.Group>
            <Form.Group className='text-center my-2'>
              <button type='submit' className='btn btn-success' disabled={loading}>
                {loading ? <ClipLoader size={20} color='#fff' /> : 'Update'}
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientDetails;