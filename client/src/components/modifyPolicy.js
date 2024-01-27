import React, { useState, useEffect } from 'react';

const ModifyPolicy = () => {
  const [policyNames, setPolicyNames] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const token = localStorage.getItem('Newtoken');

  useEffect(() => {
    // Fetch policy names when the component mounts
    const fetchPolicyNames = async () => {
      try {
        const response = await fetch('/api/getPolicyNames');
        const data = await response.json();

        if (response.ok) {
          setPolicyNames(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPolicyNames();
  }, []);

  const handlePolicyChange = async () => {
    try {
      // Fetch the selected policy content
      const response = await fetch(`/api/policies?name=${selectedPolicy}`);
      const data = await response.json();

      if (response.ok) {
        setPolicyContent(data.content);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Update the policy content
      const response = await fetch(`/api/admin/modifyPolicy/${selectedPolicy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newContent: policyContent }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Policy updated successfully:', data);
        alert('Policy updated successfully');
      } else {
        console.error('Error:', data.message);
        alert('Error:');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div class="container">
      <h2>Modify Policy</h2>
      <label>Select Policy:</label>
      <select onChange={(e) => setSelectedPolicy(e.target.value)}>
        <option value="">Select a policy</option>
        {policyNames.map((policy) => (
          <option key={policy.name} value={policy.name}>
            {policy.name}
          </option>
        ))}
      </select>
      <button onClick={handlePolicyChange} disabled={!selectedPolicy}>
        Load Policy
      </button>
      <br />
      <label>Policy Content:</label>
      <textarea
        rows="10"
        cols="50"
        value={policyContent}
        onChange={(e) => setPolicyContent(e.target.value)}
        disabled={!selectedPolicy}
      ></textarea>
      <br />
      <button onClick={handleSave} disabled={!selectedPolicy}>
        Save Policy
      </button>
    </div>
  );
};

export default ModifyPolicy;
//AI PROMPT: create me a frontend react component that can be used by the admin to modify a policy. it should have a dropdown to select the policy to edit. then it should show the content of the policy in a text box that can be edited and saved.

