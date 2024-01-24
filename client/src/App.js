import React, { useState, useEffect } from 'react';
import './App.css';


//import compnents
import Search from './components/search.js';
import Register from './components/register.js';
import PolicyDisplay from './components/policyDisplay.js';
import getUserInfoFromToken from './utils/decodeToken.js';
import Verification from './components/verification.js';
import Login from './components/login.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const userInfo = getUserInfoFromToken();

    if (userInfo) {
      // update states to determine what is shown on frontend
      setIsLoggedIn(true);
      setIsAdmin(userInfo.isAdmin);
      setIsVerified(userInfo.isVerified);
    } else {
      console.log('Token not found or invalid');
    }
  }, []);

  return (
    <div>
      <Search/>
      <Register/>
      <Login/>
      <Verification/>
      <PolicyDisplay/>
    </div>
  );
}

export default App;
