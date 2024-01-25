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
      <div class="container">
        <h2>Welcome to the Superhero Database</h2>
        <p>About this page: you can create superhero lists, explore superhero's, leave reviews. Have fun!</p>
      </div>
      <Search/>
      {isLoggedIn ? "" : <Register/>}
      {isLoggedIn? "" : <Login/> }
      {isVerified ? "": <Verification/>}
      {/* logged in stuff */}
      {isLoggedIn ? <Logout/> : ""}
      {isLoggedIn ? <ChangePassword/> : ""}
      
      <ViewPublicLists/>

      {isLoggedIn ? <CreateSuperheroList/> : ""}
      {isLoggedIn ? <ViewPrivateLists/> : ""}
      {isLoggedIn ? <UpdateList/> : ""}
      {isLoggedIn ? <DeleteList/> : ""}
      {isLoggedIn ? <CreateReview/>: ""}
      {isLoggedIn ? <ViewReview/> : ""}
      {/* admin stuff */}
      {isAdmin ?
      <div>
      <div class="container">
      <h3>Admin Panel</h3>
      <GrantAdmin/>
      <UserStatus/>
      <HideReview/>
      </div> 
      <div class="container">
        <h3>DMCA Takedown Procedure</h3>
        <ol>
          <li>Upon receipt of a dispute, use the log creation tool to document the violation</li>
          <li>Send notice to both involved parties and await notice from legal. Hide the reviews that are in violation</li>
          <li>If found to be a violation, hide the reviews, disable the user account, using the above provided tools in the admin panels.</li>
          <li>Keep log records stored in database for future records if necessary.</li>
        </ol>
      </div>
      </div>
      : ""}
      <PolicyDisplay/>
    </div>
  );
}

export default App;
