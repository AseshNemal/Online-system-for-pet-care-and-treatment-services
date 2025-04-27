import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PetRecord = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petResponse, recordsResponse] = await Promise.all([
          axios.get(`http://localhost:8090/pet/petDetaile/${petId}`),
          axios.get(`http://localhost:8090/medical/${petId}`)
        ]);
  
        if (!petResponse.data.pet) {
          throw new Error('Pet not found');
        }
  
        setPet(petResponse.data.pet);
        setMedicalRecords(recordsResponse.data || []);
   
        
        
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [petId]);

  const handleDeleteRecord = (recordId) => {
    setRecordToDelete(recordId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8090/medical/delete/${recordToDelete}`);
      setMedicalRecords(medicalRecords.filter(record => record._id !== recordToDelete));
    } catch (err) {
      setError('Failed to delete record');
    } finally {
      setShowConfirm(false);
      setRecordToDelete(null);
    }
    
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (loading) return <div className="loading">Loading pet details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!pet) return <div className="no-pet">No pet found with this ID.</div>;


  

  return (
    <div className="pet-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Pets
      </button>
      
      <div className="pet-header">
        <h1>{pet.petName}</h1>
        <div className="pet-meta">
          <span>{pet.species}</span>
          {pet.breed && <span> • {pet.breed}</span>}
        </div>
      </div>

      <div className="pet-details-grid">
        <div className="detail-card">
          <h3>Basic Information</h3>
          <div className="detail-item">
            <span className="detail-label">Gender:</span>
            <span>{pet.gender || 'Unknown'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Birth Date:</span>
            <span>{formatDate(pet.bDate)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Color:</span>
            <span>{pet.color || 'Unknown'}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Health Information</h3>
          <div className="detail-item">
            <span className="detail-label">Weight:</span>
            <span>{pet.weight || 'Unknown'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Vet Visit:</span>
            <span>{formatDate(pet.lastVetVisit)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Medical Notes:</span>
            <span>{pet.medicalNotes || 'None'}</span>
          </div>
        </div>

        {pet.image && (
          <div className="pet-image-container">
            <img src={pet.image} alt={pet.petName} className="pet-image" />
          </div>
        )}
      </div><br/><br/>

      <button onClick={() => navigate(`/pet/${pet.deviceId|| 'Unknown'}`)}
        className="add-record-button">
        Pet Tracker Dashboad
        </button>

       


      <div className="medical-records-section">
        <div className="section-header">
          <h2>Medical Records</h2>
          <button onClick={() => navigate(`/pets/${petId}/medical`)}
        className="add-record-button">
        + Add New Record
        </button>
        </div>
        

        {medicalRecords.length === 0 ? (
          <div className="no-records">
            <p>No medical records found for {pet.petName}.</p>
          </div>
        ) : (
          <div className="records-list">
            {medicalRecords.map((record) => (
              <div key={record._id} className="record-card">
                <div className="record-header">
                  <h3>{record.visitType || 'Medical Visit'}</h3>
                  <span className="record-date">{formatDate(record.visitDate)}</span>
                </div>
                
                <div className="record-details">
                  <div className="detail-row">
                    <span className="detail-label">Veterinarian:</span>
                    <span>{record.veterinarian || 'Not specified'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Diagnosis:</span>
                    <span>{record.diagnosis || 'No diagnosis recorded'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Treatment:</span>
                    <span>{record.treatment || 'No treatment recorded'}</span>
                  </div>
                  
                  {record.notes && (
                    <div className="detail-row notes">
                      <span className="detail-label">Notes:</span>
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="record-actions">/pets/:petId/medical/edit/:medicalId
                  <button 
                    onClick={() => navigate(`/pets/${petId}/medical/edit/${record._id}`)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteRecord(record._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>

                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this medical record?</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pet-details-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .back-button {
          background: none;
          border: none;
          color: #3498db;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: #f0f0f0;
        }

        .pet-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .pet-header h1 {
          color: #2c3e50;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }

        .pet-meta {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .pet-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .detail-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .detail-card h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          padding: 0.5rem 0;
        }

        .detail-label {
          font-weight: 600;
          color: #34495e;
        }

        .pet-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pet-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Medical Records Section */
        .medical-records-section {
          margin-top: 3rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .add-record-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 0.7rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .add-record-button:hover {
          background-color: #2980b9;
        }

        .no-records {
          text-align: center;
          padding: 3rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }

        .records-list {
          display: grid;
          gap: 1.5rem;
        }

        .record-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #3498db;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }

        .record-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .record-date {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .record-details {
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          margin-bottom: 0.8rem;
        }

        .detail-row.notes {
          flex-direction: column;
        }

        .detail-row.notes p {
          margin: 0.5rem 0 0 0;
          color: #555;
          line-height: 1.5;
        }

        .record-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.8rem;
        }

        .edit-button, .delete-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .edit-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .edit-button:hover {
          background-color: #e0e0e0;
        }

        .delete-button {
          background-color: #f8d7da;
          color: #721c24;
        }

        .delete-button:hover {
          background-color: #f1b0b7;
        }

        /* Confirmation Modal */
        .confirmation-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
        }

        .modal-content h3 {
          margin-top: 0;
          color: #2c3e50;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .cancel-button, .confirm-delete-button {
          padding: 0.7rem 1.2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .confirm-delete-button {
          background-color: #dc3545;
          color: white;
        }

        .confirm-delete-button:hover {
          background-color: #c82333;
        }

        .loading, .error, .no-pet {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }

        .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .pet-details-container {
            padding: 1rem;
          }
          
          .detail-row {
            flex-direction: column;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PetRecord;