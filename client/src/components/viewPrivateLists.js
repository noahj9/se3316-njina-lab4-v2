import React, { useState, useEffect } from 'react';

const UserLists = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    // Fetch user's superhero lists
    fetch('/api/secure/getUserSuperheroLists', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Newtoken')}`,
      },
    })
      .then(response => response.json())
      .then(data => setLists(data))
      .catch(error => console.error('Error fetching user lists:', error));
  }, []);

  const handleListSelect = async listId => {
    try {
      // Fetch information for the selected list
      const response = await fetch(`/api/secure/getSuperheroList/${listId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Newtoken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedList(data);
      } else {
        console.error('Error fetching list details:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div class="container">
      <h2>Your Superhero Lists</h2>
      <select onChange={e => handleListSelect(e.target.value)}>
        <option value="" disabled selected>
          Select a list
        </option>
        {lists.map(list => (
          <option key={list._id} value={list._id}>
            {list.name}
          </option>
        ))}
      </select>

      {selectedList && (
        <div>
          <h3>List Details</h3>
          <p>Name: {selectedList.name}</p>
          <p>Description: {selectedList.description}</p>
          <p>Last Modified: {selectedList.lastModified}</p>
          <p>Visibility: {selectedList.isPublic ? 'Public' : 'Private'}</p>
          <p>Average Rating: {selectedList.averageRating}</p>

          <h3>Superheroes</h3>
          <ul>
            {selectedList.superheroes.map(hero => (
              <li key={hero._id}>
                Name: {hero.name}, Publisher: {hero.Publisher}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserLists;

//create me a react component that can be used for a user to view there lists. i want to show all the lists in a dropdown menu and allow the user to select one. when they select one the info for that list will be shown below (name, description, lastModified, visibility, average rating, and a list of superheroes along with their name and publisher. write me a new api to handle the displaying of the info once the list is selected. 
