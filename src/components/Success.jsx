import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";

export default function Success() {
  const [data, setData] = useState({
    patientName: "",
    doctor: "",
    hospital: "",
    bookingId: "",
    date: "",
    time: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryData = JSON.parse(decodeURIComponent(params.get("data")));
      if (queryData) {
        setData(queryData);
      }
    } catch (err) {
      console.error("Failed to parse success payload", err);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  function formatDateString(dateStr) {
    if (!dateStr) return "Tomorrow";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  function formatTimeString(timeStr) {
    if (!timeStr) return "9:45 AM";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <div className="success-container">
      <div className="success-icon-badge">✔</div>
      <h2 className="success-title">Appointment Confirmed</h2>
      <p className="success-message">Your consultation has been successfully scheduled and paid.</p>

      <div className="summary-box">
        <div className="summary-column">
          <h3>Appointment Receipt</h3>
          <p><strong>Patient Name:</strong> {data.patientName || "Guest"}</p>
          <p><strong>Doctor:</strong> Dr. {data.doctor || "Medical Specialist"}</p>
          <p><strong>Hospital/Clinic:</strong> {data.hospital || "General Hospital"}</p>
          <p><strong>Booking ID:</strong> <span className="receipt-code">{data.bookingId || "BOOK-N/A"}</span></p>
        </div>

        <div className="summary-column">
          <h3>Check-in Details</h3>
          <p><strong>Date:</strong> {formatDateString(data.date)}</p>
          <p><strong>Check-in Time:</strong> {formatTimeString(data.time)}</p>
          <p><strong>Required Document:</strong> Valid Photo ID Proof</p>
          <p><strong>Support Contact:</strong> 1800-123-456</p>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handlePrint} className="btn-print">🖨️ Print Slip</button>
        <button onClick={handleBackToDashboard} className="btn-portal">🏠 Back to Patient Portal</button>
      </div>
    </div>
  );
}
