import React, { useState, useEffect } from 'react';

const GrantAdminAccess = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [grantAdminStatus, setGrantAdminStatus] = useState('');

  useEffect(() => {
    // Fetch the list of users for the dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/getAllUsers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('Newtoken'),
            },});
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleGrantAdmin = async () => {
    try {
      const response = await fetch(`/api/admin/grantAdminPrivileges/${selectedUser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Newtoken'),
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGrantAdminStatus(`Admin access granted to ${data.email}`);
      } else {
        console.error('Error:', data.message);
        setGrantAdminStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setGrantAdminStatus('Error: Internal Server Error');
    }
  };

  return (
    <div className="container">
      <h2>Grant Admin Access</h2>
      <label>Select User:</label>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="" disabled selected>Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.email}</option>
        ))}
      </select>
      <button onClick={handleGrantAdmin}>Grant Admin Access</button>
      <div>{grantAdminStatus}</div>
    </div>
  );
};

export default GrantAdminAccess;
//AI PROMPT: create me a frontend react component that can be used for the admin to grant admin access to a user. their should be a dropdown with all the users emails, when the admin selects one and clicks a button access will be granted to that user.
