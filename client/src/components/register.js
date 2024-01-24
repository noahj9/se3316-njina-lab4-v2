import React, { useState } from 'react';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkProperEmailFormat = (email) => {
        // Basic email format validation
        //test criteria from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          alert('Invalid email format');
          return;
      }
      }
    checkProperEmailFormat(email);

    // Call the registration API
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      if (response.status === 201) {
        alert('User registration successful');
      } else if (response.status === 409) {
        alert('User with this email already exists');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div class="container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="text" value={email} onChange={handleEmailChange} required />
        
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        
        <label>Nickname:</label>
        <input type="text" value={nickname} onChange={handleNicknameChange} required />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

//AI PROMPT: create me a react component for registration. i want a form that will accept email, password, nickname as input, and on submission will call the register api. We should check to ensure the email is in proper email format. I don't want to use any external packages, just a simple html form with javascript to call the api and validate input is fine.
