import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "../submitAd.css"

function SubmitAd() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [type, setType] = useState("")
  const [breed, setBreed] = useState("")
  const [weight, setWeight] = useState("")
  const [description, setDescription] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.")
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!image || !type || !breed || !weight || !description || !contactNumber) {
      setError("All fields are required.")
      setLoading(false)
      return
    }

    const weightValue = Number(weight)
    if (weightValue <= 0) {
      setError("Weight must be greater than 0.")
      setLoading(false)
      return
    }

    if (weightValue > 200) {
      setError("Weight cannot exceed 200 kg.")
      setLoading(false)
      return
    }

    if (description.length > 500) {
      setError("Description must be 500 characters or less.")
      setLoading(false)
      return
    }
    
    const phoneRegex = /^\d{10,12}$/
    if (!phoneRegex.test(contactNumber)) {
      setError("Contact number must be 10-12 digits and contain only numbers.")
      setLoading(false)
      return
    }

    try {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = async () => {
        const base64Image = reader.result
        const adData = {
          image: base64Image,
          type,
          breed,
          weight: weightValue,
          description,
          contactNumber,
          
        }

        await axios.post("https://online-system-for-pet-care-and-treatment.onrender.com/pet-ad/submit", adData)
        setSuccess("Ad submitted successfully, awaiting approval!")
        setImage(null)
        setImagePreview("")
        setType("")
        setBreed("")
        setWeight("")
        setDescription("")
        setContactNumber("")
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to submit ad.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="submit-ad-container">
      <div className="back-button-container">
        <Link to="/adoption-portal" className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          Back to Adoption Portal
        </Link>
      </div>

      <div className="submit-ad-card">
        <div className="card-header">
          <div className="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z" />
            </svg>
          </div>
          <h2>Submit a Pet for Adoption</h2>
          <p className="subtitle">Help your pet find a loving home</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-grid">
            <div className="form-group image-upload-group">
              <label className="form-label">Pet Image</label>
              <div className="image-upload-container">
                <div className={`image-upload-area ${imagePreview ? "has-image" : ""}`}>
                  {imagePreview ? (
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                      </svg>
                      <p>Upload an image</p>
                    </div>
                  )}
                  <input type="file" className="file-input" accept="image/*" onChange={handleImageChange} />
                </div>
                <small className="form-text">Max size: 5MB. Recommended: Square image.</small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pet Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Goat">Goat</option>
                <option value="Cow">Cow</option>
                <option value="Bird">Bird</option>
                <option value="Squirrel">Squirrel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Breed</label>
              <input
                type="text"
                className="form-control"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                max="200"
                step="0.1"
                placeholder="e.g. 15.5"
              />
              <small className="form-text">Maximum: 200kg</small>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength="500"
                rows="4"
                placeholder="Describe your pet's personality, habits, and any special needs..."
              ></textarea>
              <div className="character-count">
                <small className="form-text">{description.length}/500 characters</small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                maxLength="12"
                placeholder="e.g. 1234567890"
              />
              <small className="form-text">10-12 digits only</small>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                </svg>
                <span>Submit Ad</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitAd
