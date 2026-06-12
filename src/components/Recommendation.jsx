import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recommendation.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function Recommendation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  
  const {
    recommended_specialists = [],
    doctors = [],
  } = location.state || {};

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      fetch(`${BACKEND_URL}/patient-details/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => setPatient(data))
        .catch(err => console.error("Error fetching patient details:", err));
    }
  }, [userId]);

  const handlePayment = (doctor) => {
    // Fallback if Razorpay Key is not set or missing
    const razorpayKey = RAZORPAY_KEY_ID || "rzp_test_zHlO3JzZc9jXgW";
    
    const options = {
      key: razorpayKey,
      amount: doctor.fees * 100,
      currency: "INR",
      name: "Healthcare Portal",
      description: `Consultation Booking: Dr. ${doctor.name}`,
      handler: async function (responsePayment) {
        console.log("Razorpay payment success:", responsePayment);
        try {
          const response = await fetch(`${BACKEND_URL}/appointments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patient_id: parseInt(userId),
              doctor_id: doctor.doctor_id,
              slot_id: doctor.slot_id,
              reason: "Booked via AI Assistant"
            }),
          });

          const data = await response.json();

          const patientDetails = await fetch(`${BACKEND_URL}/patient-details/${userId}`);
          const patientData = await patientDetails.json();

          const payload = {
            patientName: patientData.name,
            doctor: doctor.name,
            hospital: doctor.hospital,
            bookingId: `BOOK-${data.appointment_id}`,
            date: doctor.next_available_date,
            time: doctor.start_time
          };
          const encoded = encodeURIComponent(JSON.stringify(payload));
          navigate(`/success?data=${encoded}`);
        } catch (err) {
          console.error("Appointment creation failed:", err);
        }
      },
      prefill: {
        name: patient?.name || "Patient Name",
        email: "patient@healthcare.com",
        contact: patient?.contact_number || "9999999999",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  function formatDateTime(dateString, timeString) {
    if (!dateString || !timeString) return "Not available";

    const date = new Date(`${dateString}T${timeString}`);
    const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dateFormatted = date.toLocaleDateString("en-GB");
    const timeFormatted = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${dayOfWeek}, ${dateFormatted} at ${timeFormatted}`;
  }

  // Helper to generate rating stars
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= roundedRating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-header-row">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <h2 className="recommendation-heading">Consultation Recommendations</h2>
        <div style={{ width: "100px" }}></div>
      </div>

      <div className="recommendation-content">
        {recommended_specialists.length > 0 ? (
          <div className="specialists-card">
            <p className="recommendation-text">
              Based on the symptoms you described, we highly recommend consulting a specialist in:
            </p>
            <div className="specialist-tags-container">
              {recommended_specialists.map((spec, idx) => (
                <span key={idx} className="specialist-tag">
                  ⚕️ {spec.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="warning-card">
            <p className="warning-text">⚠️ No specific specialist recommendations were matched based on the symptoms.</p>
          </div>
        )}

        <h3 className="section-subtitle">Matching Doctors Available</h3>

        {doctors.length > 0 ? (
          <div className="doctor-card-container">
            {doctors.map((doc, index) => (
              <div className="doctor-card" key={index}>
                <div className="doctor-info">
                  <div className="doctor-primary-row">
                    <p className="doctor-name">👨‍⚕️ Dr. {doc.name}</p>
                    <span className="doctor-spec-badge">{doc.specialization}</span>
                  </div>
                  
                  <div className="doctor-details-grid">
                    <p><strong>🏥 Hospital:</strong> {doc.hospital}</p>
                    <p className="rating-row">
                      <strong>⭐ Rating:</strong> 
                      <span className="stars-container">{renderStars(doc.rating)}</span> 
                      <span className="rating-num">({doc.rating})</span>
                    </p>
                    <p><strong>💰 Consultation Fee:</strong> <span className="fee-amount">₹{doc.fees}</span></p>
                    <p><strong>📅 Next Available:</strong> <span className="slot-time">{formatDateTime(doc.next_available_date, doc.start_time)}</span></p>
                  </div>
                </div>
                
                <div className="doctor-actions">
                  <button className="book-btn" onClick={() => handlePayment(doc)}>
                    Confirm & Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-doctors-card">
            <p className="warning-text">No matching doctors are available with upcoming slots for these specializations at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
