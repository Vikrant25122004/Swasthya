import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCall() {
  const containerRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
    const location = useLocation();
  const { role, patientName,patientphone } = location.state || {};
  console.log(patientphone);
 

  // Your appID and serverSecret — replace with your credentials
  const appID = 493102007;
  const serverSecret = "c161ffeb0835b2a818195908d5327599";


 const userID = `user_${Math.floor(Math.random() * 10000)}`;
 console.log(patientName);
const userName = "User_" + userID;
  useEffect(() => {
    if (!roomId) {
      navigate(role === "doctor" ? "/doctor/profile" : "/patienthome");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userID,
      userName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    console.log(patientName);

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      showPreJoinView: true,
      onLeaveRoom: () => {
        // Navigate based on role
        if (role === "doctor") {
          navigate("/prescription",{ state: { patientName,patientphone } });

        } else {
          navigate("/patienthome/onlinedoctors");
        }
      },
    });

    return () => {
      zp.destroy();
    };
  }, [roomId, navigate, role]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
