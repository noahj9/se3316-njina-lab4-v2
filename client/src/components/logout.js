import React, { useState, useEffect } from 'react';
import getUserInfoFromToken from '../utils/decodeToken.js';

const LogoutButton = () => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [isVerified, setIsVerified] = useState(false);
const [nickname, setNickname] = useState(false);

  useEffect(() => {
    const userInfo = getUserInfoFromToken();

    if (userInfo) {
      // update states to determine what is shown on frontend
      setIsLoggedIn(true);
      setIsAdmin(userInfo.isAdmin);
      setIsVerified(userInfo.isVerified);
      setNickname(userInfo.nickname);
    } else {
      console.log('Token not found or invalid');
    }
  }, []);

  const handleLogout = async () => {
    try {
        localStorage.removeItem('Newtoken');
        console.log("token removed from local store");
        alert("Logout completed");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div class="container">
    <h4>{nickname}'s Account Status:</h4>
    <p>Verified: {isVerified ? "Yes" : "No"}</p>
    <p>Admin: {isAdmin ? "Yes" : "No"}</p>
    <button onClick={handleLogout}>
      Logout
    </button>
    </div>
  );
};

export default LogoutButton;
