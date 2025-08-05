import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { FileText, Download, TrendingUp, DollarSign, Bot, ExternalLink } from 'lucide-react';

import "./Patientprescription.css"
const Patientprescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [aiResult, setAiResult] = useState({}); // AI explanation per orderid
  const [aiLoading, setAiLoading] = useState(null); // orderid currently analyzing
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("patienttoken");

  useEffect(() => {
    if (!token) {
      setError("User not authenticated. Please login.");
      setLoading(false);
      return;
    }
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/patient/gethistorycheckups", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const msg = await response.text();
          setError(msg || "Failed to fetch prescription history.");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError("Network error while fetching history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const getPdfDataUrl = (prescription) => {
    if (!prescription.prescriptionbyte) return null;
    if (typeof prescription.prescriptionbyte === "string") {
      return `data:${prescription.prescriptiontype};base64,${prescription.prescriptionbyte}`;
    }
    const byteArray = new Uint8Array(prescription.prescriptionbyte);
    let binary = "";
    for (let b of byteArray) binary += String.fromCharCode(b);
    return `data:${prescription.prescriptiontype};base64,${btoa(binary)}`;
  };

  const handleAI = async (prescription) => {
    setAiLoading(prescription.orderid);
    let base64String;
    if (typeof prescription.prescriptionbyte === "string") {
      base64String = prescription.prescriptionbyte;
    } else {
      base64String = btoa(String.fromCharCode(...new Uint8Array(prescription.prescriptionbyte)));
    }
    try {
      const resp = await fetch("http://localhost:8080/patient/analyseprescription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: base64String,
      });
      if (!resp.ok) {
        alert("Failed to analyze prescription.");
        setAiLoading(null);
        return;
      }
      const aiText = await resp.text();
      setAiResult((prev) => ({ ...prev, [prescription.orderid]: aiText }));
    } catch (e) {
      alert("AI analysis failed.");
    }
    setAiLoading(null);
  };

  const startPayment = async (orderid, amount) => {
    if (!orderid || !amount) {
      alert("Invalid order details.");
      return;
    }

    setPayingOrderId(orderid);
    setPaying(true);

    const RAZORPAY_KEY_ID = "rzp_test_qaKBNUQeP8i9yL"; // Replace with your Razorpay key
    try {
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
        amount: parseInt(amount), // in paise
        currency: "INR",
        name: "Swasthya",
        description: "Consultation Payment",
        order_id: orderid,
        handler: async function () {
          try {
            await fetch("http://localhost:8080/patient/makepayment", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "text/plain",
              },
              body: orderid,
            });
            alert("Payment successful!");
            setPrescriptions((ps) =>
              ps.map((p) =>
                p.orderid === orderid ? { ...p, paid: true } : p
              )
            );
          } catch {
            alert("Payment confirmation failed, contact support.");
          }
        },
        prefill: {},
        theme: { color: "#008080" },
        modal: {
          ondismiss: () => {
            setPaying(false);
            setPayingOrderId(null);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment initialization failed.");
      setPaying(false);
      setPayingOrderId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!prescriptions.length) return <p>No prescription history found.</p>;

  return (
    <div className="history-container">
      <h2 className="main-title">
        <FileText size={32} className="title-icon"/>
        Prescription History
      </h2>
      <ul className="prescription-list">
        {prescriptions.map((prescription, idx) => {
          const pdfLink = getPdfDataUrl(prescription);
          const isPayingThis = paying && payingOrderId === prescription.orderid;
          const isAiLoadingThis = aiLoading === prescription.orderid;

          return (
            <li key={idx} className="prescription-item">
              <div className="item-details">
                <div>
                  <p><strong>Doctor:</strong> {prescription.doctorname}</p>
                  <p><strong>Problem:</strong> {prescription.problem}</p>
                  <p><strong>Amount:</strong> ₹{prescription.amount}</p>
                  <p><strong>Status:</strong> <span className={prescription.paid ? "status-paid" : "status-pending"}>
                    {prescription.paid ? "Paid" : "Pending Payment"}
                  </span></p>
                  {pdfLink ? (
                    <a href={pdfLink} target="_blank" rel="noopener noreferrer" download={prescription.prescriptionname || `prescription_${idx + 1}.pdf`} className="pdf-link">
                      <Download size={16} /> View Prescription
                    </a>
                  ) : (
                    <span className="no-document">No document available</span>
                  )}
                </div>
                <div className="item-actions">
                  {/* AI Button */}
                  <button
                    onClick={() => handleAI(prescription)}
                    title="Understand with AI"
                    disabled={isAiLoadingThis}
                    className="ai-button"
                  >
                    <Bot size={20} />
                    {isAiLoadingThis ? "Analyzing..." : "Understand with AI"}
                  </button>

                  {/* Pay Button */}
                  {!prescription.paid && (
                    <button
                      disabled={isPayingThis}
                      onClick={() => startPayment(prescription.orderid, prescription.amount)}
                      className="pay-button"
                    >
                      {isPayingThis ? "Processing Payment..." : "Pay"}
                    </button>
                  )}
                </div>
              </div>

              {/* AI Analysis output */}
              {aiResult[prescription.orderid] && (
                <div className="ai-result">
                  <strong>AI Explanation:</strong><br />
                  {aiResult[prescription.orderid]}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Patientprescription;
