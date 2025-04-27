import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [user, setUser] = useState(null);
  const [uid, setUID] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null); // To handle which feedback's menu is open
  const [editingId, setEditingId] = useState(null); // To handle editing feedback ID
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(0);

  useEffect(() => {
    // Fetch logged-in user
    axios.get("http://localhost:8090/get-session", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setUID(res.data.user._id);
        }
      })
      .catch((err) => console.error(err));

    // Fetch existing feedbacks
    axios.get("http://localhost:8090/feedback/all")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText || rating === 0) {
      alert("Please fill in both feedback and rating.");
      return;
    }

    const newFeedback = {
      userId: uid,
      userName: user.dispalyName,
      feedback: feedbackText,
      rating,
    };

    try {
      const res = await axios.post("http://localhost:8090/feedback/add", newFeedback);
      const savedFeedback = res.data;

      setFeedbacks([savedFeedback, ...feedbacks]);
      setFeedbackText("");
      setRating(0);
      setSuccessMessage("Thank you for your feedback!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleStarHover = (index) => {
    setHoverRating(index);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = (currentRating, onClickFn = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: onClickFn ? "pointer" : "default",
            color: i <= currentRating ? "gold" : "gray",
            fontSize: "24px",
            transition: "color 0.2s ease",
          }}
          onClick={onClickFn ? () => onClickFn(i) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const toggleMenu = (id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null);
    } else {
      setMenuOpenId(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:8090/feedback/delete/${id}`);
        setFeedbacks(feedbacks.filter(fb => fb._id !== id));
      } catch (err) {
        console.error("Failed to delete feedback", err);
      }
    }
  };

  const handleEditStart = (fb) => {
    setEditingId(fb._id);
    setEditingText(fb.feedback);
    setEditingRating(fb.rating);
    setMenuOpenId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:8090/feedback/edit/${editingId}`, {
        feedback: editingText,
        rating: editingRating,
      });

      const updated = res.data;

      setFeedbacks(
        feedbacks.map((fb) => (fb._id === editingId ? updated : fb))
      );
      setEditingId(null);
      setEditingText("");
      setEditingRating(0);
    } catch (err) {
      console.error("Failed to update feedback", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Leave Your Feedback</h2>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your feedback here..."
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
        <div style={{ marginBottom: "10px" }}>
          {renderStars(hoverRating || rating, handleStarClick)}
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit Feedback
        </button>
      </form>

      <h2>What People Are Saying</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div
            key={fb._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <h4>{fb.userName}</h4>

            {editingId === fb._id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ width: "100%", height: "80px", marginBottom: "10px" }}
                />
                <div style={{ marginBottom: "10px" }}>
                  {renderStars(editingRating, setEditingRating)}
                </div>
                <button onClick={handleEditSubmit} style={{ marginRight: "10px" }}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={{ color: "gold" }}>
                  {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                </div>
                <p>{fb.feedback}</p>

                {fb.userId === uid && (
                  <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    <button
                      onClick={() => toggleMenu(fb._id)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ⋮
                    </button>
                    {menuOpenId === fb._id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "25px",
                          right: "0",
                          background: "white",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => handleEditStart(fb)}
                          style={{ display: "block", width: "100%", padding: "8px", border: "none", background: "white", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fb._id)}
                          style={{ display: "block", width: "100%", padding: "8px", border: "none", background: "white", cursor: "pointer" }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackPage;
