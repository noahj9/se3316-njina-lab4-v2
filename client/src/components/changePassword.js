import React, { useState } from 'react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    try {
      // Assuming you have a function to get the token from local storage
      const token = localStorage.getItem('Newtoken');

      const response = await fetch('/api/secure/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error changing password. Please try again.');
    }
  };

  const isFormValid = currentPassword && newPassword && newPassword === confirmNewPassword;

  return (
    <div class="container">
      <h2>Change Password</h2>
      <div>
        <label htmlFor="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleChangePassword} disabled={!isFormValid}>
          Change Password
        </button>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChangePassword;

//AI PROMPT: make me a react component for a user to change their password using the above api you gave me