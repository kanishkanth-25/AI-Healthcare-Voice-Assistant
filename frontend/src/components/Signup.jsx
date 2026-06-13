import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import "./Signup.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [contact, setContact] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Simple Validation
    if (!email || !password || !name || !dob || !contact) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          date_of_birth: dob,
          gender,
          contact_number: contact,
          blood_group: bloodGroup,
          marital_status: maritalStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Registration failed. Please try again.");
      }

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="form-title">Create Healthcare Account</h2>
      
      {errorMessage && (
        <div className="alert-message error">
          ❌ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="alert-message success">
          ✔ {successMessage}
        </div>
      )}

      <form onSubmit={handleSignup} className="signup-form">
        <div className="signup-grid">
          {/* Column 1 */}
          <div className="signup-column-fields">
            <h3 className="section-label">Login Credentials</h3>
            <InputField
              type="email"
              placeholder="Email Address"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <h3 className="section-label">Demographics</h3>
            <InputField
              type="text"
              placeholder="Full Name"
              icon="person"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="custom-input-wrapper">
              <label className="field-label">Date of Birth</label>
              <input
                type="date"
                className="custom-date-picker"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="signup-column-fields">
            <h3 className="section-label">Contact & Health Profiles</h3>
            
            <InputField
              type="tel"
              placeholder="Contact Number"
              icon="phone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <div className="custom-input-wrapper">
              <label className="field-label">Gender</label>
              <select
                className="custom-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="custom-input-wrapper">
              <label className="field-label">Blood Group</label>
              <select
                className="custom-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="custom-input-wrapper">
              <label className="field-label">Marital Status</label>
              <select
                className="custom-select"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="signup-button">Register Account</button>
      </form>

      <p className="login-prompt">
        Already have an account? <span className="login-link" onClick={() => navigate("/")}>Log in here</span>
      </p>
    </div>
  );
};

export default Signup;
