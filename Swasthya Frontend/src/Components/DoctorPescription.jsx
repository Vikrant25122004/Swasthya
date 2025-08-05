import React, { useEffect, useState } from "react";
import { X, FileText, Star } from 'lucide-react';

import { connectWebSocket, disconnectWebSocket } from "./websocketClient";
import "./DoctorPrescription.css"

function StarRating({ value, onChange, disabled }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: 22,
            color: value >= star ? "#FFD600" : "#BBBBBB",
            cursor: disabled ? "not-allowed" : "pointer",
            marginRight: 4,
            userSelect: "none",
          }}
          onClick={() => !disabled && onChange(star)}
          aria-label={`Rate ${star}`}
          role="button"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function DoctorPescription({ onClose }) {
  const [prescriptionMsg, setPrescriptionMsg] = useState(null);
  const [show, setShow] = useState(true);

  const [paying, setPaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");

  const patientphone = localStorage.getItem("patientnumber");

  useEffect(() => {
    if (!patientphone) return;

    connectWebSocket(
      patientphone,
      (msg) => {
        setPrescriptionMsg(msg);
        setSubmitted(false);
        setRating(0);
        setError("");
      },
      null,
      (err) => console.error("WebSocket error:", err)
    );

    return () => disconnectWebSocket();
  }, [patientphone]);

  if (!show || !prescriptionMsg) return null;

  const RAZORPAY_KEY_ID = "rzp_test_qaKBNUQeP8i9yL";

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  // Razorpay payment handler
  const handlePayment = async () => {
    setPaying(true);
    try {
      const amount = prescriptionMsg.amount || 50000; // in paise fallback
      const backendOrderId = prescriptionMsg.orderid;

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Swasthya Consultation",
        description: "Doctor Video Consultation Payment",
        order_id: backendOrderId,
      
        handler: async function (response) {
          try {
            const token = localStorage.getItem("patienttoken");
            await fetch("http://localhost:8080/patient/makepayment", {
              method: "POST",
              headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${token}`,
              },
              body: backendOrderId
            });
            alert("Payment successful!");
            setShow(false);
            if (onClose) onClose();
          } catch (err) {
            alert("Payment confirmation failed. Please contact support.");
          }
        },
        prefill: {
          name: prescriptionMsg.patientname,
        },
        theme: { color: "#008080" },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment initiation failed.");
      setPaying(false);
    }
  };

  // Rating submit handler - send using URL encoded form (per your backend)
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const patienttoken = localStorage.getItem("patienttoken");
      const params = new URLSearchParams();
      params.append("doctoremail", prescriptionMsg.doctoremail);
      params.append("ratings", rating);

      const response = await fetch("http://localhost:8080/patient/setratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${patienttoken}`,
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Failed to submit rating.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("Network error while submitting rating. Please try again.");
    }
    setSubmitting(false);
  };

  // Convert prescriptionbyte to base64 for PDF preview
  let pdfSrc = null;
  if (prescriptionMsg.prescriptionbyte) {
    let base64;
    if (typeof prescriptionMsg.prescriptionbyte === "string") {
      base64 = prescriptionMsg.prescriptionbyte;
    } else if (Array.isArray(prescriptionMsg.prescriptionbyte)) {
      const bytes = new Uint8Array(prescriptionMsg.prescriptionbyte);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = window.btoa(binary);
    }
    pdfSrc = `data:${prescriptionMsg.prescriptiontype || "application/pdf"};base64,${base64}`;
  }

  return (
    <div className="prescription-modal" role="alert">
      <button onClick={handleClose} className="close-btn" title="Close" aria-label="Close">
        <X size={20} />
      </button>

      <div className="prescription-card">
        <h4 className="card-title">
          <FileText size={20} /> Prescription from Dr. {prescriptionMsg.doctorname}
        </h4>
        <div className="card-content">
          <p><strong>Patient:</strong> {prescriptionMsg.patientname}</p>
          <p><strong>Problem:</strong> {prescriptionMsg.problem}</p>
        </div>

        {pdfSrc ? (
          <a
            href={pdfSrc}
            target="_blank"
            rel="noopener noreferrer"
            download={prescriptionMsg.prescriptionname || "prescription.pdf"}
            className="download-link"
          >
            View / Download Prescription PDF
          </a>
        ) : (
          <p className="no-document">
            No prescription PDF available
          </p>
        )}

        <button
          onClick={handlePayment}
          className="payment-btn"
          disabled={paying}
        >
          {paying ? "Processing..." : "Make Payment"}
        </button>

        <form onSubmit={handleRatingSubmit} className="rating-form">
          <div className="rating-label">Rate your experience:</div>
          <StarRating value={rating} onChange={setRating} disabled={submitted || submitting} />
          <button
            type="submit"
            disabled={rating === 0 || submitted || submitting}
            className="submit-rating-btn"
          >
            {submitting ? "Submitting..." : submitted ? "Thank you!" : "Submit Rating"}
          </button>
          {error && (
            <div className="rating-error">
              {error}
            </div>
          )}
          {submitted && (
            <div className="rating-success">
              Your rating has been submitted!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};