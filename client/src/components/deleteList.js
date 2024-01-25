import React, { useState, useEffect } from 'react';

const DeleteSuperheroList = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    // Fetch user's superhero lists when component mounts
    // Replace the API endpoint with the one you use to get user superhero lists
    fetch('/api/secure/getUserSuperheroLists', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include your JWT token from local storage in the Authorization header
        'Authorization': `Bearer ${localStorage.getItem('Newtoken')}`
      }
    })
      .then(response => response.json())
      .then(data => setLists(data))
      .catch(error => console.error('Error fetching superhero lists:', error));
  }, []);

  const handleDeleteClick = () => {
    // Check if a list is selected
    if (!selectedList) {
      alert('Please select a superhero list to delete.');
      return;
    }

    // Replace the API endpoint with the one you use to delete a superhero list
    fetch(`/api/secure/deleteSuperheroList/${selectedList}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Include your JWT token from local storage in the Authorization header
        'Authorization': `Bearer ${localStorage.getItem('Newtoken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        // Refresh the list of superhero lists after deletion
        window.location.reload();
      })
      .catch(error => console.error('Error deleting superhero list:', error));
  };

  return (
    <div class="container">
      <h2>Delete Superhero List</h2>
      <label>Select a superhero list:</label>
      <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
        <option value="">Select a list</option>
        {lists.map(list => (
          <option key={list._id} value={list._id}>{list.name}</option>
        ))}
      </select>
      <button onClick={handleDeleteClick}>Delete Selected List</button>
    </div>
  );
};

export default DeleteSuperheroList;

//make me a frontend component that the user can use to delete a list. it should have a dropdown with the lists that the user has created. then a button to delete the selected list.
