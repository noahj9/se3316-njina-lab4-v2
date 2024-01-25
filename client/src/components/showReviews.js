import React, { useState, useEffect } from 'react';

const ReviewList = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [reviews, setReviews] = useState([]);
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

  useEffect(() => {
    // Fetch reviews when a list is selected
    const fetchReviews = async () => {
      if (selectedList) {
        try {
          const response = await fetch(`/api/getReviews/${selectedList}`);
          const data = await response.json();

          if (response.ok) {
            setReviews(data);
          } else {
            console.error('Error:', data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchReviews();
  }, [selectedList]);

  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  return (
    <div className="container">
      <h2>Reviews</h2>
      <label>Select a Public List:</label>
      <select onChange={handleListChange} value={selectedList}>
        <option value="">Select a list</option>
        {publicLists.map((list) => (
          <option key={list._id} value={list._id}>
            {list.name}
          </option>
        ))}
      </select>

      {selectedList && (
        <div>
          <h3>Reviews for {selectedList}</h3>
          <ul>
            {reviews.map((review) => (
              <li key={review._id}>
                <p>Rating: {review.rating}</p>
                <p>Comment: {review.comment}</p>
                <p>Created By: {review.createdBy}</p>
                <p>Created At: {new Date(review.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
