import { useState, useEffect } from "react"
import axios from "axios"
import "../feedbackform.css"

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [feedbackText, setFeedbackText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [user, setUser] = useState(null)
  const [uid, setUID] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [editingRating, setEditingRating] = useState(0)

  useEffect(() => {
    // Fetch logged-in user
    axios
      .get("https://online-system-for-pet-care-and-treatment.onrender.com/get-session", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user)
          setUID(res.data.user._id)
        }
      })
      .catch((err) => console.error(err))

    // Fetch existing feedbacks
    axios
      .get("https://online-system-for-pet-care-and-treatment.onrender.com/feedback/all")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!feedbackText || rating === 0) {
      alert("Please fill in both feedback and rating.")
      return
    }

    const newFeedback = {
      userId: uid,
      userName: user.displayName,
      feedback: feedbackText,
      rating,
    }

    try {
      const res = await axios.post("https://online-system-for-pet-care-and-treatment.onrender.com/feedback/add", newFeedback)
      const savedFeedback = res.data

      setFeedbacks([savedFeedback, ...feedbacks])
      setFeedbackText("")
      setRating(0)
      setSuccessMessage("Thank you for your feedback!")

      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Failed to submit feedback", err)
    }
  }

  const handleStarClick = (index) => {
    setRating(index)
  }

  const handleStarHover = (index) => {
    setHoverRating(index)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const renderStars = (currentRating, onClickFn = null) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (currentRating || 0) ? "star-gold" : "star-gray"}`}
          onClick={onClickFn ? () => onClickFn(i) : undefined}
          onMouseEnter={onClickFn ? () => handleStarHover(i) : undefined}
          onMouseLeave={onClickFn ? handleStarLeave : undefined}
        >
          ★
        </span>,
      )
    }
    return stars
  }

  const toggleMenu = (id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null)
    } else {
      setMenuOpenId(id)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`https://online-system-for-pet-care-and-treatment.onrender.com/feedback/delete/${id}`)
        setFeedbacks(feedbacks.filter((fb) => fb._id !== id))
      } catch (err) {
        console.error("Failed to delete feedback", err)
      }
    }
  }

  const handleEditStart = (fb) => {
    setEditingId(fb._id)
    setEditingText(fb.feedback)
    setEditingRating(fb.rating)
    setMenuOpenId(null)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/feedback/edit/${editingId}`, {
        feedback: editingText,
        rating: editingRating,
      })

      const updated = res.data

      setFeedbacks(feedbacks.map((fb) => (fb._id === editingId ? updated : fb)))
      setEditingId(null)
      setEditingText("")
      setEditingRating(0)
    } catch (err) {
      console.error("Failed to update feedback", err)
    }
  }

  return (
    <div className="feedback-container">
      {/* Feedbacks at the top */}
      <h2 className="section-title">What People Are Saying</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb._id} className="feedback-item">
              <h4 className="feedback-username">{fb.userName}</h4>

              {editingId === fb._id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="star-rating">{renderStars(editingRating, setEditingRating)}</div>
                  <button onClick={handleEditSubmit} className="edit-button">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="feedback-stars">
                    {"★".repeat(fb.rating)}
                    {"☆".repeat(5 - fb.rating)}
                  </div>
                  <p className="feedback-text">{fb.feedback}</p>

                  {fb.userId === uid && (
                    <div>
                      <button onClick={() => toggleMenu(fb._id)} className="menu-button">
                        ⋮
                      </button>
                      {menuOpenId === fb._id && (
                        <div className="menu-dropdown">
                          <button onClick={() => handleEditStart(fb)} className="menu-item">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(fb._id)} className="menu-item">
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

      {/* Feedback form at the bottom */}
      <div className="feedback-form">
        <h2 className="section-title">Leave Your Feedback</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here..."
            className="feedback-textarea"
          />
          <div className="star-rating">{renderStars(hoverRating || rating, handleStarClick)}</div>
          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackPage
