import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';

const PetRecord = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    visitType: "",
    visitDate: "",
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8090/medical/${petId}`, {
        visitType: formData.visitType,
        visitDate: formData.visitDate,
        veterinarian: formData.veterinarian,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
      });

      const recordsResponse = await axios.get(`http://localhost:8090/medical/${petId}`);
      setMedicalRecords(recordsResponse.data);
      setShowModal(false);
      setFormData({
        visitType: "",
        visitDate: "",
        veterinarian: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      });
    } catch (err) {
      setError("Failed to add medical record");
      console.error("Error adding medical record:", err);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await axios.delete(`http://localhost:8090/medical/${recordId}`);
      const recordsResponse = await axios.get(`http://localhost:8090/medical/${petId}`);
      setMedicalRecords(recordsResponse.data);
    } catch (err) {
      setError("Failed to delete medical record");
      console.error("Error deleting medical record:", err);
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
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Header>
          <h2>Pet Information</h2>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Name:</strong> {pet.petName}</p>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Gender:</strong> {pet.gender}</p>
              <p><strong>Owner:</strong> {pet.owner}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>Medical Records</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Record
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Veterinarian</th>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record) => (
                <tr key={record._id}>
                  <td>{formatDate(record.visitDate)}</td>
                  <td>{record.visitType}</td>
                  <td>{record.veterinarian}</td>
                  <td>{record.diagnosis}</td>
                  <td>{record.treatment}</td>
                  <td>{record.notes}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRecord(record._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Medical Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddRecord}>
            <Form.Group className="mb-3">
              <Form.Label>Visit Type</Form.Label>
              <Form.Control
                type="text"
                name="visitType"
                value={formData.visitType}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Visit Date</Form.Label>
              <Form.Control
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Veterinarian</Form.Label>
              <Form.Control
                type="text"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                as="textarea"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Treatment</Form.Label>
              <Form.Control
                as="textarea"
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Record
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .pet-details-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .device-id-container {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .device-id-input {
          padding: 0.5rem;
          font-size: 1rem;
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .device-id-save-button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .device-id-save-button:hover {
          background-color: #2980b9;
        }

        .device-id-message {
          margin-top: 0.5rem;
          color: #555;
          font-size: 0.9rem;
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