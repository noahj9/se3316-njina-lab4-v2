import React, { useState, useEffect } from 'react';

const UserStatusUpdate = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('Newtoken')}`,
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

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleDisableUser = async () => {
    await updateUserStatus(true);
  };

  const handleEnableUser = async () => {
    await updateUserStatus(false);
  };

  const updateUserStatus = async (status) => {
    try {
      const response = await fetch(`/api/admin/updateUserStatus/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('Newtoken')}`,
        },
        body: JSON.stringify({ isDisabled: status }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User status updated successfully:', data);
        // Optionally, update the UI or show a success message
      } else {
        console.error('Error:', data.message);
        // Handle error, show an error message, etc.
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>User Status Update</h2>
      <label>Select User:</label>
      <select onChange={(e) => handleUserSelect(e.target.value)}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.email}</option>
        ))}
      </select>
      {selectedUserId && (
        <div>
          <button onClick={handleDisableUser}>Disable User</button>
          <button onClick={handleEnableUser}>Enable User</button>
        </div>
      )}
    </div>
  );
};

export default UserStatusUpdate;
//AI PROMPT: make me a frontend react component for this. the admin should be able to select a user email from the dropdown then be shown two buttons, one to disable the user, one to enable the user.
