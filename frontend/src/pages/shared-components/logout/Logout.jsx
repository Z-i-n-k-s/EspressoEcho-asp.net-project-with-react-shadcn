// Logout.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user from Redux and localStorage
    dispatch(clearUser());
    
    // Redirect to home page after logout
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;