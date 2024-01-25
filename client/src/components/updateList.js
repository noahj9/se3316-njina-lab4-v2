import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const UpdateSuperheroList = ({ authToken }) => {
  const [userLists, setUserLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listData, setListData] = useState({});
  const { register, handleSubmit, setValue } = useForm();

  const token = localStorage.getItem('Newtoken');

  useEffect(() => {
    // Fetch user's superhero lists
    const fetchUserLists = async () => {
      try {
        const response = await fetch('/api/secure/getUserSuperheroLists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserLists(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserLists();
  }, [authToken]);

  const handleListSelect = async (listId) => {
    try {
      const response = await fetch(`/api/secure/getSuperheroList/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSelectedList(listId);
        setListData(data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/secure/updateSuperheroList/${selectedList}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('List updated successfully:', data);
        // Optionally, update state or perform any other actions upon successful update
      } else {
        console.error('Error updating list:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Update Superhero List</h2>
      <label>Select a list to update:</label>
      <select onChange={(e) => handleListSelect(e.target.value)}>
        <option value="" disabled selected>
          Choose a list
        </option>
        {userLists.map((list) => (
          <option key={list._id} value={list._id}>
            {list.name}
          </option>
        ))}
      </select>

      {selectedList && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>List Name:</label>
          <input {...register('name')} defaultValue={listData.name} />
          <label>Description:</label>
          <textarea {...register('description')} defaultValue={listData.description} />
          <label>Is Public:</label>
          <input type="checkbox" {...register('isPublic')} defaultChecked={listData.isPublic} />
          <label>Average Rating:</label>
          <input type="number" {...register('averageRating')} defaultValue={listData.averageRating} />

          <button type="submit">Save List</button>
        </form>
      )}
    </div>
  );
};

export default UpdateSuperheroList;
//AI PROMPT
//create me a frontend react component that can be used for a user to update a list. all the lists that the user has created should be populated in a dropdown. when they select one a form should open prefilled with the current content of the list. they should be able to edit the content and save the list.
