import React, { useState, useEffect } from 'react';

const CreateReview = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('Newtoken');

  useEffect(() => {
    // Fetch public superhero lists when the component mounts
    const fetchPublicLists = async () => {
      try {
        const response = await fetch('/api/publicSuperheroLists');
        const data = await response.json();

        if (response.ok) {
          setPublicLists(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPublicLists();
  }, []);

  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create a new review
      const response = await fetch(`/api/secure/addReview/${selectedList}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Replace with your actual access token
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Review created successfully:', data);
        alert("Review created successfully");
      } else {
        console.error('Error:', data.message);
        alert("Error:", data.message);
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error:", data.message);
    }
  };

  return (
    <div class="container">
      <h2>Create Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="select-list">Select List:</label>
          <select id="select-list" onChange={handleListChange} value={selectedList}>
            <option value="">Select a list</option>
            {publicLists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
        {selectedList && (
          <div>
            <label htmlFor="select-rating">Rating:</label>
            <input
              type="number"
              id="select-rating"
              min="0"
              max="5"
              value={rating}
              onChange={handleRatingChange}
              required
            />
          </div>
        )}
        {selectedList && (
          <div>
            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" value={comment} onChange={handleCommentChange}></textarea>
          </div>
        )}
        {selectedList && (
          <div>
            <button type="submit">Submit Review</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateReview;
//AI PROMPT
//make me a frontend react component that can be used to create a review. it should have a dropdown with the names of the public lists. once a list is selected the form should open below to create a new review and save it. 