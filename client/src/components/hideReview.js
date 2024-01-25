import React, { useState, useEffect } from 'react';

const UpdateReviewStatus = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const token = localStorage.getItem('Newtoken');

  useEffect(() => {
    // Fetch all reviews
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/admin/getAllReviews', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
          });
        const data = await response.json();

        if (response.ok) {
          setReviews(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSelect = (event) => {
    setSelectedReview(event.target.value);
    setUpdatedStatus(null);
  };

  const handleUpdateStatus = async () => {
    try {
      // Call the backend API to update the review status
      const response = await fetch(`/api/admin/updateReviewStatus/${selectedReview}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setUpdatedStatus('Review status updated successfully');
      } else {
        console.error('Error:', data.message);
        setUpdatedStatus('Error updating review status');
      }
    } catch (error) {
      console.error('Error:', error);
      setUpdatedStatus('Error updating review status');
    }
  };

  return (
    <div class="container">
      <h2>Update Review Status</h2>
      <label>Select Review:</label>
      <select value={selectedReview} onChange={handleReviewSelect}>
        <option value="" disabled>Select a review</option>
        {reviews.map((review) => (
          <option key={review._id} value={review._id}>
            {review._id}
          </option>
        ))}
      </select>
      <button onClick={handleUpdateStatus} disabled={!selectedReview}>
        Update Status
      </button>
      {updatedStatus && <p>{updatedStatus}</p>}
    </div>
  );
};

export default UpdateReviewStatus;
//AI PROMPT
//make me a frontend react component that can be used with the above api. i want a dropdown list of all the review ids then the admin can select a review and click a button to update the hidden status