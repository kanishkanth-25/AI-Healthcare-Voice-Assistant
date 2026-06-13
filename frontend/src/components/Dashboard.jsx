import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    // Fetch patient details
    fetch(`${BACKEND_URL}/patient-details/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch patient details");
        return res.json();
      })
      .then(data => setPatient(data))
      .catch(err => setError(err.message));

    // Fetch medical history
    fetch(`${BACKEND_URL}/medical-history/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch medical history");
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => setError(err.message));
  }, [navigate, userId]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const startTriage = () => {
    navigate("/assistant");
  };

  if (error) return <div className="error-message-container">❌ Error: {error}</div>;
  if (!patient || !history) return <div className="loading-container"><div className="loading-spinner"></div>Loading records...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Patient Portal</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Patient Info Section */}
        <section className="patient-information-section">
          <h2>Patient Profile</h2>
          <div className="patient-info-grid">
            <div className="patient-info-column">
              <div className="patient-info-item">
                <strong>Full Name:</strong> <span>{patient.name}</span>
              </div>
              <div className="patient-info-item">
                <strong>Date of Birth:</strong> <span>{patient.date_of_birth}</span>
              </div>
              <div className="patient-info-item">
                <strong>Gender:</strong> <span>{patient.gender}</span>
              </div>
              <div className="patient-info-item">
                <strong>Contact Number:</strong> <span>{patient.contact_number}</span>
              </div>
            </div>
            <div className="patient-info-column">
              <div className="patient-info-item">
                <strong>Blood Group:</strong> <span className="badge-blood">{patient.blood_group}</span>
              </div>
              <div className="patient-info-item">
                <strong>Marital Status:</strong> <span>{patient.marital_status}</span>
              </div>
              <div className="patient-info-item">
                <strong>Record Number:</strong> <span>{patient.medical_record_number}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Medical History Section */}
        <section className="patient-medical-history-section">
          <h2>Medical History</h2>
          <div className="medical-history-grid">
            <div className="medical-history-column">
              <div className="medical-history-item">
                <strong>Past Diagnoses</strong>
                <span>{history.past_diagnoses || "None recorded"}</span>
              </div>
              <div className="medical-history-item">
                <strong>Surgeries</strong>
                <span>{history.surgeries || "None recorded"}</span>
              </div>
              <div className="medical-history-item">
                <strong>Hospital Admissions</strong>
                <span>{history.hospital_admissions || "None recorded"}</span>
              </div>
            </div>
            <div className="medical-history-column">
              <div className="medical-history-item">
                <strong>Lifestyle Factors</strong>
                <span>{history.lifestyle_factors || "None recorded"}</span>
              </div>
              <div className="medical-history-item">
                <strong>Immunization Records</strong>
                <span>{history.immunization_records || "None recorded"}</span>
              </div>
              <div className="medical-history-item">
                <strong>Family Medical History</strong>
                <span>{history.family_medical_history || "None recorded"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Appointment Triage Help Section */}
      <div className="appointment-help-section">
        <h3>Need to Schedule an Appointment?</h3>
        <p>Talk with our AI Medical Assistant using voice commands to check your symptoms and get matched with the right specialist.</p>
        <button className="btn-primary start-triage-btn" onClick={startTriage}>
          🎙️ Start AI Voice Assistant
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;
