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
    <div class="container">
      <h2>Account Verification</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleGenerateVerificationLink}>Generate Verification Link</button>
      </div>
      <div>
        {verificationLink && (
          <div>
            <p>Hi, Thanks for registering your account on the superhero database. Please paste the below verification link in your browser to verify your account.</p>
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

//AI PROMPT: create me a react component for a user to verify their account. it should be a simple form that accepts the users email and calls the api to generate the verification link when they submit the form. The verification link should then be shown below the form along with a quick message.