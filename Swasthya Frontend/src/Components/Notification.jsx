import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWebSocket, disconnectWebSocket } from "./websocketClient";

export default function Notification({ doctorEmail }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    connectWebSocket(
      doctorEmail,
      (message) => {
        if (message.roomId) setIncomingCall(message);
      },
      null,
      (err) => console.error("WebSocket error:", err)
    );

    return () => disconnectWebSocket();
  }, [doctorEmail]);

  if (!incomingCall) return null;

  const handleClose = () => {
    setIncomingCall(null);
  };

  const handleJoinCall = () => {
    navigate(`/video-call/${incomingCall.roomId}`, {
      state: { role: "doctor",patientphone:incomingCall.patientName },
    });
    setIncomingCall(null);
  };

  return (
    <div
      className="notification-popup"
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        background: "#fff",
        border: "2px solid #00796b",
        borderRadius: 12,
        padding: 20,
        zIndex: 1000,
        width: 300,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <button
        onClick={handleClose}
        aria-label="Close notification"
        title="Dismiss"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "transparent",
          border: "none",
          fontSize: 20,
          fontWeight: "bold",
          color: "#777",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        &times;
      </button>
      <h3 style={{ marginTop: 0, marginBottom: 12, color: "#00796b" }}>
        Incoming Video Call
      </h3>
      <p style={{ marginBottom: 20 }}>
        <strong>{incomingCall.patientName || "Patient"}</strong> is calling you
        for a consultation.
      </p>
      <button
        onClick={handleJoinCall}
        style={{
          backgroundColor: "#00796b",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Join Call
      </button>
    </div>
  );
}
