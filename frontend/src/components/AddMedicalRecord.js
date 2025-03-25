import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMedicalRecord = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitDate: '',
    visitType: 'Routine Checkup',
    veterinarian: '',
    diagnosis: '',
    treatment: '',
    medications: [],
    notes: ''
  });
  const [currentMedication, setCurrentMedication] = useState({
    name: '',
    dosage: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedication = () => {
    if (currentMedication.name && currentMedication.dosage) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, currentMedication]
      }));
      setCurrentMedication({ name: '', dosage: '' });
    }
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8090/medical`, {
        ...formData,
        petId
      });
      navigate(`/pets/${petId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save record');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Medical Record</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Visit Date:</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Visit Type:</label>
          <select
            name="visitType"
            value={formData.visitType}
            onChange={handleChange}
          >
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Illness">Illness</option>
            <option value="Injury">Injury</option>
            <option value="Surgery">Surgery</option>
            <option value="Dental">Dental</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Veterinarian:</label>
          <input
            type="text"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Diagnosis:</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Treatment:</label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Medications:</label>
          <div className="medication-input">
            <input
              type="text"
              name="name"
              placeholder="Medication name"
              value={currentMedication.name}
              onChange={handleMedicationChange}
            />
            <input
              type="text"
              name="dosage"
              placeholder="Dosage"
              value={currentMedication.dosage}
              onChange={handleMedicationChange}
            />
            <button type="button" onClick={addMedication}>
              Add
            </button>
          </div>
          
          {formData.medications.length > 0 && (
            <div className="medication-list">
              {formData.medications.map((med, index) => (
                <div key={index} className="medication-item">
                  <span>{med.name} ({med.dosage})</span>
                  <button 
                    type="button" 
                    onClick={() => removeMedication(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/pets/${petId}`)}>
            Cancel
          </button>
          <button type="submit">Save Record</button>
        </div>
      </form>

      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .error-message {
          color: #e74c3c;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #f8d7da;
          border-radius: 4px;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .medication-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .medication-input input {
          flex: 1;
        }
        
        .medication-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .medication-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button[type="submit"] {
          background: #3498db;
          color: white;
        }
        
        button[type="submit"]:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default AddMedicalRecord;