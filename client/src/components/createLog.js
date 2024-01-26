import React, { useState, useEffect } from 'react';

const CreateDMCALog = () => {
  const [formData, setFormData] = useState({
    reviewId: '',
    receivedDate: '',
    noticeSentDate: '',
    disputeReceivedDate: '',
    notes: '',
    status: 'Active'
  });

  const [reviewOptions, setReviewOptions] = useState([]);
  const token = localStorage.getItem('Newtoken');

  useEffect(() => {
    // Fetch all reviews for the dropdown menu
    const fetchAllReviews = async () => {
      try {
        const response = await fetch('/api/admin/getAllReviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setReviewOptions(data);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAllReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the API to create a DMCA log entry
      const response = await fetch('/api/admin/createDMCALog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('DMCA log entry created:', data);
        // Optionally, you can reset the form after a successful submission
        setFormData({
          reviewId: '',
          receivedDate: '',
          noticeSentDate: '',
          disputeReceivedDate: '',
          notes: '',
          status: 'Active'
        });
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div class="container">
      <h2>Create DMCA Log Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Review ID:
          <select name="reviewId" value={formData.reviewId} onChange={handleChange}>
            <option value="" disabled>Select Review ID</option>
            {reviewOptions.map((review) => (
              <option key={review._id} value={review._id}>
                {review._id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Received Date:
          <input type="date" name="receivedDate" value={formData.receivedDate} onChange={handleChange} />
        </label>
        <label>
          Notice Sent Date:
          <input type="date" name="noticeSentDate" value={formData.noticeSentDate} onChange={handleChange} />
        </label>
        <label>
          Dispute Received Date:
          <input type="date" name="disputeReceivedDate" value={formData.disputeReceivedDate} onChange={handleChange} />
        </label>
        <label>
          Notes:
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Processed">Processed</option>
          </select>
        </label>
        <button type="submit">Create DMCA Log Entry</button>
      </form>
    </div>
  );
};

export default CreateDMCALog;
