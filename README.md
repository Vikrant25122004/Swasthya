# 🩺 Swasthya: Your 24/7 Online Health Partner
Swasthya (meaning "Health" in Hindi) is a secure and intelligent online healthcare platform that instantly connects patients with certified doctors for emergency consultations. This full-stack web application streamlines the entire consultation process, from real-time video calls to AI-powered prescription explanations and secure payments, making quality healthcare more accessible than ever.

## ✨ Features
Swasthya is designed with a dual-sided marketplace in mind, providing a seamless experience for both healthcare professionals and patients.

### For Patients
#### Secure Video Consultations: Instantly connect with online doctors via HIPAA-compliant video calls using ZEGOCLOUD.

#### Emergency Access: Log in as a patient to quickly find and consult with available doctors.

#### Real-time Prescriptions: Receive digital prescriptions as PDF documents in real-time after your consultation.

#### "Understand with AI" Feature: Never struggle to read a doctor's handwriting again. Our Gemini AI model provides a clear, detailed explanation of your prescription and the doctor's assessment.

#### Razorpay Payment Integration: Securely pay for your consultation. Subsequent consultations are locked until payment for the previous one is confirmed.

### For Doctors
#### Effortless Registration & Login: Doctors can easily register and manage their professional profiles, including their specialty and experience.

#### Real-time Availability: The system uses WebSockets and Server-Side Rendering to show a doctor's online/offline status in real-time, allowing patients to find available practitioners instantly.

#### Past Patient Records: A dedicated dashboard to view past consultations, patient problems, and prescription history.

#### Incoming Call Notifications: Receive real-time notifications for incoming video call requests from patients.

#### Secure Payment Receipt: Payments are processed securely via Razorpay, ensuring doctors are compensated for their time.

## 🛠️ Tech Stack
1. Frontend: <p align="center"><img src="https://skillicons.dev/icons?i=javascript,react"/></p>

2. Backend: <p align="center"><img src="https://skillicons.dev/icons?i=java,spring"/></p>

3. Database: <p align="center"><img src="https://skillicons.dev/icons?i=mongodb"/></p>

4. AI/ML: <p align="center"><img src="https://skillicons.dev/icons?i=ai"/></p>

5. Video Conferencing: <p align="center"><img src="https://skillicons.dev/icons?i=WebRTC"/></p>

Real-time Communication: <p align="center"><img src="https://skillicons.dev/icons?i=redis,kafka,websockets"/></p>

## Payment Gateway: 

Prescription Generation: Real-time PDF generation and delivery.

## 📷 Screenshots
<p align="center">
<img src="Screenshot 2025-08-07 133215.png" alt="Landing Page" width="800"/>
<br />
<em>The landing page where users can choose to register as a doctor or an emergency patient.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133257.png" alt="Key Features" width="800"/>
<br />
<em>A section on the landing page highlighting the key features of the platform.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133340.png" alt="Doctor Registration" width="800"/>
<br />
<em>The Doctor Registration form, where doctors can provide their professional details.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133420.png" alt="Doctor Login" width="800"/>
<br />
<em>The Doctor Login page.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133501.png" alt="Doctor Profile" width="800"/>
<br />
<em>The Doctor's profile dashboard, displaying their personal and professional information.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133543.png" alt="Patient Registration" width="800"/>
<br />
<em>The Patient Registration form.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133618.png" alt="Patient Login" width="800"/>
<br />
<em>The Patient Login page.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133700.png" alt="Available Doctors" width="800"/>
<br />
<em>Patients can view a list of available doctors and initiate a video call.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133727.png" alt="Join Room (Patient)" width="800"/>
<br />
<em>The screen where a patient joins a video call room.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133803.png" alt="Incoming Call (Doctor)" width="800"/>
<br />
<em>A real-time notification on the doctor's profile for an incoming video call.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133846.png" alt="Join Room (Doctor)" width="800"/>
<br />
<em>The screen where a doctor joins a video call room.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133918.png" alt="Active Video Call" width="800"/>
<br />
<em>A view of the active video consultation screen.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 134102.png" alt="Prescription PDF" width="800"/>
<br />
<em>A sample of the real-time generated PDF prescription.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 134256.png" alt="AI Prescription Explanation" width="800"/>
<br />
<em>The "Understand with AI" feature providing a detailed breakdown of the prescription.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 134147.png" alt="Past Patients" width="800"/>
<br />
<em>The doctor's dashboard showing a history of past patients and their consultation details.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 133952.png" alt="Payment Successful" width="800"/>
<br />
<em>The successful payment confirmation screen using Razorpay.</em>
</p>

<p align="center">
<img src="Screenshot 2025-08-07 134332.png" alt="Payment Required" width="800"/>
<br />
<em>A user prompt indicating that payment is required for the previous consultation before they can proceed.</em>
</p>

# 🏁 Getting Started
To get a local copy of this project up and running, follow these simple steps.

## Prerequisites
- ### Java 17 or higher

- ### Maven

- ### Node.js 18 or higher

- ### npm or yarn

- ### Docker and Docker Compose (recommended for an easier setup)

A running instance of MongoDB, Redis, and Kafka.

## Installation
Clone the repository

```Bash```

```git clone https://github.com/your-username/swasthya.git```
```cd swasthya```
Set up Environment Variables
Create a `.env` file in the root directory and add the following configuration. Replace the placeholder values with your actual credentials.

Bash

# Spring Boot Backend Configuration
```MONGODB_URI=mongodb://localhost:27017/Swasthya```
```KAFKA_BROKERS=localhost:9092```
```REDIS_URI=redis://localhost:6379```

# Gemini AI Configuration
```GEMINI_API_KEY=YOUR_GEMINI_API_KEY```

# ZEGOCLOUD Video Call Configuration
```ZEGOCLOUD_APP_ID=YOUR_ZEGOCLOUD_APP_ID```
```ZEGOCLOUD_SERVER_SECRET=YOUR_ZEGOCLOUD_SERVER_SECRET```

# Razorpay Payment Gateway
```RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID```
```RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET```
Start the Backend  ![Spring Boot](https://img.shields.io/badge/spring%20boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
Navigate to the backend directory and run the application using Maven.

```Bash```

```cd backend```
```./mvnw spring-boot:run```
Start the Frontend ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
Open a new terminal, navigate to the frontend directory, and start the React development server.

```Bash```

```cd frontend```
```npm install```
```npm start```
Access the Application
Open your web browser and navigate to http://localhost:5173.

Using Docker (Recommended)
To run the entire stack with a single command, you can use Docker Compose.

Configure .env file: Ensure your .env file is configured with all the necessary variables as described above.

Start the services:

```Bash```

```docker-compose up```
This command will build and start all services, making the application accessible at http://localhost:5173.

# 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

- ### Fork the Project

- ### Create your Feature Branch (git checkout -b feature/AmazingFeature)

- ### Commit your Changes (git commit -m 'Add some AmazingFeature')

- ### Push to the Branch (git push origin feature/AmazingFeature)

- ### Open a Pull Request

# 📄 License
Distributed under the MIT License. See the LICENSE file for more information.
