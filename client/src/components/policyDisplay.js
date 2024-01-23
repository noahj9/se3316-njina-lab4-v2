import React, { useState, useEffect } from 'react';

const PolicyDisplay = () => {
  const [dmcaPolicy, setDmcaPolicy] = useState('');
  const [securityPrivacyPolicy, setSecurityPrivacyPolicy] = useState('');
  const [acceptableUsePolicy, setAcceptableUsePolicy] = useState('');

  useEffect(() => {
    // Fetch DMCA Policy
    fetchPolicy('dmcaPolicy')
      .then(response => setDmcaPolicy(response.content))
      .catch(error => console.error('Error fetching DMCA Policy:', error));

    // Fetch Security & Privacy Policy
    fetchPolicy('security_privacyPolicy')
      .then(response => setSecurityPrivacyPolicy(response.content))
      .catch(error => console.error('Error fetching Security & Privacy Policy:', error));

    // Fetch Acceptable Use Policy
    fetchPolicy('acceptable_usePolicy')
      .then(response => setAcceptableUsePolicy(response.content))
      .catch(error => console.error('Error fetching Acceptable Use Policy:', error));
  }, []);

  const fetchPolicy = async (policyName) => {
    try {
      const response = await fetch(`/api/policies?name=${policyName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${policyName} policy.`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <div class="container">
      <h2>DMCA Policy</h2>
      <p>{dmcaPolicy}</p>

      <h2>Security & Privacy Policy</h2>
      <p>{securityPrivacyPolicy}</p>

      <h2>Acceptable Use Policy</h2>
      <p>{acceptableUsePolicy}</p>
    </div>
  );
};

export default PolicyDisplay;

//AI PROMPT: write me a frontend component that call this api 3 times once for each of the policies;
//dmcaPolicy, security_privacyPolicy, acceptable_usePolicy.
//i want to then display the content of the policies.