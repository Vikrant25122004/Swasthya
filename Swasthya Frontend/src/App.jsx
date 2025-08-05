import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DoctorAuth from './Components/DoctorAuth';
import Landing from './Components/Landing';
import Patientauth from './Components/Patientauth';

import './App.css'
import DoctorDashboard from './Components/DoctorDashboard';
import DoctorProfile from './Components/DoctorProfile';
import PastPatient from './Components/PastPatient';
import DoctorNavbar from './Components/DoctorNavbar';
import PatientDashboard from './Components/PatientDashboard';
import VideoCall from './Components/VideoCall';
import PatientNavbar from './Components/PatientNavbar';
import PatientProfile from './Components/PatientProfile';
import Patientprescription from './Components/Patientprescription';
import Prescription from './Components/Prescription';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/doctorauth',
    element: <DoctorAuth />
  },
  {
    path: '/patientauth',
    element: <Patientauth />
  },
  {
  path: '/patienthome',
  element: <PatientNavbar />,
  children: [
    { index: true,path:'onlinedoctors',  element: <PatientDashboard /> }, // /patienthome
    {path: 'profile', element:<PatientProfile/>},
    {path: 'prescriptions',element:<Patientprescription/>}
    // add more patient pages as needed
  ]
},
  { path:"/video-call/:roomId",
    element:<VideoCall role="patient" />
  },
   { path:"/video-call/:roomId",
    element:<VideoCall role="doctor" />
  },
  { path: "/prescription", element: <Prescription /> },


  {
     path: '/doctor',
    element: <DoctorNavbar />,     // Parent component that renders navbar and an <Outlet />
    children: [
      {
        path: 'dashboard',
        element: <DoctorDashboard />,
      },
      {
        index : true,
        path: 'profile',
        element: <DoctorProfile />,
      },
      {
        path: 'pastpatient',    // singular as you wrote "pastpatient"
        element: <PastPatient />,
      },
      
    ]
  }
    
]);

function App() {

  
     return <RouterProvider router={router} />;

  
}

export default App
