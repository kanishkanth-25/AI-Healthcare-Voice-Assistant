import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Assistant.css";
import va from "../assets/assistant.jpg";
import { datacontext } from "../context/UserContext";

export default function Assistant() {
  const { connect, disconnect, messages, status } = useContext(datacontext);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="assistant-wrapper">
      {/* Left Panel: Triage Control Panel */}
      <div className="left-panel">
        <div className="panel-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Portal
          </button>
          <div className="assistant-header">🩺 AI Medical Assistant</div>
          <div style={{ width: "65px" }}></div> {/* balance the header layout */}
        </div>

        <div className="assistant-avatar-area">
          <div className={`avatar-container ${status === "Listening" ? "pulse-listening" : ""} ${status === "Speaking" ? "pulse-speaking" : ""}`}>
            <img
              src={va}
              alt="Medical Assistant"
              className="assistant-image"
            />
            {status !== "Idle" && (
              <div className="voice-waves">
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
              </div>
            )}
          </div>
          
          <div className={`status-badge ${status.toLowerCase()}`}>
            <span className="status-dot"></span>
            {status === "Listening" ? "Listening to your symptoms..." : status === "Speaking" ? "Speaking..." : "Voice agent standby"}
          </div>
        </div>

        <div className="assistant-footer">
          <button 
            onClick={connect} 
            className={`btn-connect ${status === "Listening" ? "active" : ""}`}
            disabled={status === "Listening"}
          >
            🎙️ Start Session
          </button>
          <button 
            onClick={disconnect} 
            className="btn-disconnect"
            disabled={status === "Idle"}
          >
            ⏹️ End & Analyze
          </button>
        </div>
      </div>

      {/* Right Panel: Conversation Transcript */}
      <div className="right-panel">
        <div className="transcript-title">Consultation Transcript</div>
        <div className="messages-container">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className={`message-bubble-wrapper ${message.sender.toLowerCase() === "patient" ? "patient-wrapper" : "assistant-wrapper-bubble"}`}>
                <div className={`message-bubble ${message.sender.toLowerCase()}`}>
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-transcript">
              <span className="triage-icon">🎙️</span>
              <p>Click <strong>Start Session</strong> and say your symptoms. (e.g. "I have a headache since yesterday and feel slightly feverish.")</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
