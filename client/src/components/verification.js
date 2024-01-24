import React, { useState } from 'react';

const AccountVerification = () => {
  const [email, setEmail] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerateVerificationLink = async () => {
    try {
      const response = await fetch('/api/generateVerificationToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationLink(data.verificationLink);
        setMessage('Verification link generated successfully. Check below.');
      } else {
        setVerificationLink('');
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setVerificationLink('');
      setMessage('Error generating verification link. Please try again.');
    }
  };

  return (
    <div>
      <h2>Account Verification</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleGenerateVerificationLink}>Generate Verification Link</button>
      </div>
      <div>
        <p>{message}</p>
        {verificationLink && (
          <div>
            <p>Verification Link:</p>
            <a href={verificationLink} target="_blank" rel="noopener noreferrer">
              {verificationLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountVerification;
