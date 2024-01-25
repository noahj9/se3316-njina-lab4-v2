import React, { useState, useEffect } from 'react';
import './App.css';


//import compnents
import Search from './components/search.js';
import Register from './components/register.js';
import PolicyDisplay from './components/policyDisplay.js';
import getUserInfoFromToken from './utils/decodeToken.js';
import Verification from './components/verification.js';
import Login from './components/login.js';
import Logout from './components/logout.js';
import ChangePassword from './components/changePassword.js';
import CreateSuperheroList from './components/createSuperheroList.js';
import ViewPrivateLists from './components/viewPrivateLists.js';
import ViewPublicLists from './components/viewPublicLists.js';
import DeleteList from './components/deleteList.js';
import UpdateList from './components/updateList.js';
import CreateReview from './components/createReview.js';
import ViewReview from './components/showReviews.js';
import GrantAdmin from './components/grantAdmin.js';
import UserStatus from './components/userStatus.js';
import HideReview from './components/hideReview.js';

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

  return ( //add update password, logout
    <div>
      <Search/>
      {isLoggedIn ? "" : <Register/>}
      {isLoggedIn? "" : <Login/> }
      {isVerified ? "": <Verification/>}
      {/* logged in stuff */}
      <Logout/>
      <ChangePassword/>
      <CreateSuperheroList/>
      <ViewPrivateLists/>
      <ViewPublicLists/>
      <UpdateList/>
      <DeleteList/>
      <CreateReview/>
      <ViewReview/>
      {/* admin stuff */}
      <GrantAdmin/>
      <UserStatus/>
      <HideReview/>


      <PolicyDisplay/>
    </div>
  );
}

export default App;
