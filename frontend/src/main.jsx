import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css';
import Navbar from './assets/components/Navbar.jsx';
import TripDetails from './pages/TripDetails.jsx';
import Chatroom from './pages/Chatroom.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; //import these modules
import Debug from './pages/Debug.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Edit from './pages/Edit';
const router = createBrowserRouter([
  {
    path: "/",
    element : <App/>,
    children : [
      {
        path: "/dashboard",
        element : <Dashboard/>
      },
      {
        path: "/debug",
        element : <Debug/>
      },
      {
        path: "/create",
        element : <Create/>
      },
      {
        path: "/profile/:userId",
        element : <Profile/>
      },
      {
        path: "/trip/:tripId",
        element: <TripDetails/>
      },
      {
        path: "/chat/:chatId",
        element: <Chatroom/>    
      },
      {
        path: "/edit/:tripId",
        element: <Edit/>    
      },
      {
        path: "/login",
        element: <Login/>    
      },
      {
        path: "/register",
        element: <Register/>    
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
