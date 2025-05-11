import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../adoptionPortal.css";

function AdoptionPortal() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchApprovedAds();
  }, []); // First useEffect to fetch ads

  async function fetchApprovedAds() {
    try {
      setLoading(true);
      const response = await axios.get("https://online-system-for-pet-care-and-treatment.onrender.com/pet-ad/approved");
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setError("Failed to load adoption ads.");
    } finally {
      setLoading(false);
    }
  }

  // Use useMemo to compute filteredAds instead of a separate useEffect
  const filteredAds = useMemo(() => {
    let result = [...ads];

    // Filter by type
    if (filterType && filterType !== "all") {
      result = result.filter((ad) => ad.type === filterType);
    }

    // Filter by search term (breed or description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (ad) =>
          ad.breed.toLowerCase().includes(term) ||
          ad.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [ads, searchTerm, filterType]); // Dependencies for useMemo

  function handleContactClick(pet) {
    setSelectedPet(pet);
    setContactDialogOpen(true);
  }

  function closeContactDialog() {
    setContactDialogOpen(false);
  }

  function closeDetailsDialog() {
    setSelectedPet(null);
  }

  return (
    <div className="adoption-portal">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <svg
            className="hero-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <h1 className="hero-title">Find Your Perfect Companion</h1>
          <p className="hero-subtitle">Browse our selection of loving pets looking for their forever homes</p>
          <div className="hero-buttons">
            <Link to="/submit-ad" className="btn-primary">
              Submit a Pet for Adoption
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-container">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by breed or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-container">
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Goat">Goat</option>
              <option value="Cow">Cow</option>
              <option value="Bird">Bird</option>
              <option value="Squirrel">Squirrel</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {error && (
          <div className="alert alert-error">
            <svg
              className="alert-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading available pets...</p>
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="pets-grid">
            {filteredAds.map((ad) => (
              <div key={ad._id} className="pet-card">
                <div className="pet-image-container">
                  <img
                    src={ad.image || "/placeholder.svg"}
                    alt={`${ad.type} - ${ad.breed}`}
                    className="pet-image"
                  />
                  <div className="pet-type-badge">{ad.type}</div>
                </div>
                <div className="pet-content">
                  <h3 className="pet-title">{ad.breed}</h3>
                  <p className="pet-weight">
                    <strong>Weight:</strong> {ad.weight} kg
                  </p>
                  <p className="pet-description">{ad.description}</p>
                  <div className="pet-actions">
                    <button className="btn-outline" onClick={() => setSelectedPet(ad)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                      </svg>
                      Details
                    </button>
                    <button className="btn-contact" onClick={() => handleContactClick(ad)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                      </svg>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg
              className="empty-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <h3 className="empty-title">No pets found</h3>
            <p className="empty-text">
              {searchTerm || filterType
                ? "Try adjusting your search or filters"
                : "There are currently no pets available for adoption"}
            </p>
            {(searchTerm || filterType) && (
              <button
                className="btn-clear-filters"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pet Details Dialog */}
      {selectedPet && (
        <div className="dialog-overlay" onClick={closeDetailsDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title">
                {selectedPet.breed}
                <span className="pet-type-badge">{selectedPet.type}</span>
              </div>
              <div className="dialog-subtitle">Pet ID: {selectedPet._id.substring(0, 8)}</div>
            </div>
            <div className="dialog-content">
              <img
                src={selectedPet.image || "/placeholder.svg"}
                alt={selectedPet.breed}
                className="dialog-image"
              />

              <div className="detail-section">
                <div className="detail-label">Weight</div>
                <div className="detail-value">{selectedPet.weight} kg</div>
              </div>

              <div className="dialog-separator"></div>

              <div className="detail-section">
                <div className="detail-label">Description</div>
                <div className="detail-value">{selectedPet.description}</div>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn-outline" onClick={closeDetailsDialog}>
                Close
              </button>
              <button
                className="btn-contact"
                onClick={() => {
                  handleContactClick(selectedPet);
                  closeDetailsDialog();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                </svg>
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Dialog */}
      {contactDialogOpen && (
        <div className="dialog-overlay" onClick={closeContactDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title">Contact Information</div>
              <div className="dialog-subtitle">
                Reach out to the owner of {selectedPet?.breed} to discuss adoption
              </div>
            </div>
            <div className="dialog-content">
              <div className="contact-container">
                <svg
                  className="contact-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="contact-number">{selectedPet?.contactNumber}</div>
                <div className="contact-label">Owner's contact number</div>
              </div>

              <div className="contact-tips">
                <p>When contacting the owner:</p>
                <ul className="tips-list">
                  <li>Introduce yourself and explain why you're interested</li>
                  <li>Ask about the pet's temperament and habits</li>
                  <li>Inquire about any special needs or medical history</li>
                  <li>Discuss the adoption process and any requirements</li>
                </ul>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn-contact" onClick={closeContactDialog}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdoptionPortal;