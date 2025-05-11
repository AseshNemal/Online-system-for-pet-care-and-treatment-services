import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditMedicalRecord = () => {
  const { petId, recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState({
    visitType: '',
    visitDate: '',
    veterinarian: '',
    diagnosis: '',
    treatment: '',
    medications: [''],
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`https://online-system-for-pet-care-and-treatment.onrender.com/medical/single/${recordId}`);
        if (!response.data) {
          throw new Error('Medical record not found');
        }
        setRecord({
          ...response.data,
          medications: Array.isArray(response.data.medications)
            ? response.data.medications.map(med => typeof med === 'string' ? med : med.name || JSON.stringify(med))
            : [''],
          visitDate: response.data.visitDate?.split('T')[0] || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching record data');
        setLoading(false);
      }
    };

    fetchRecordData();
  }, [petId, recordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, value) => {
    const newMedications = [...record.medications];
    newMedications[index] = value;
    setRecord(prev => ({
      ...prev,
      medications: newMedications
    }));
  };

  const addMedication = () => {
    setRecord(prev => ({
      ...prev,
      medications: [...prev.medications, '']
    }));
  };

  const removeMedication = (index) => {
    const newMedications = [...record.medications];
    newMedications.splice(index, 1);
    setRecord(prev => ({
      ...prev,
      medications: newMedications
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.put(`https://online-system-for-pet-care-and-treatment.onrender.com/medical/${recordId}`, record);
      navigate(`/pets/${petId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating record');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading medical record...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="edit-record-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Records
      </button>

      <h1>Edit Medical Record</h1>

      <form onSubmit={handleSubmit} className="edit-record-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="visitType">Visit Type</label>
            <select
              id="visitType"
              name="visitType"
              value={record.visitType}
              onChange={handleChange}
              required
            >
              <option value="">Select Visit Type</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgery">Surgery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="visitDate">Visit Date</label>
              <input
                type="date"
                id="visitDate"
                name="visitDate"
                value={record.visitDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="veterinarian">Veterinarian</label>
              <input
                type="text"
                id="veterinarian"
                name="veterinarian"
                value={record.veterinarian}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={record.diagnosis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="treatment">Treatment</label>
            <input
              type="text"
              id="treatment"
              name="treatment"
              value={record.treatment}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Medications</label>
            {record.medications.map((med, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={med}
                  onChange={(e) => handleMedicationChange(index, e.target.value)}
                  style={{ flex: 1, marginRight: '0.5rem' }}
                />
                {record.medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(index)} style={{ padding: '0.3rem 0.6rem' }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMedication} style={{ marginTop: '0.5rem' }}>
              + Add Medication
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={record.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/pets/${petId}/medical-records`)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .edit-record-container {
          max-width: 800px;
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

        h1 {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
        }

        .edit-record-form {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #34495e;
        }

        input[type="text"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #3498db;
          outline: none;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-button,
        .submit-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #2ecc71;
          color: white;
        }

        .submit-button:hover {
          background-color: #27ae60;
        }

        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .loading, .error {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }

        .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .edit-record-container {
            padding: 1rem;
          }
          
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditMedicalRecord;