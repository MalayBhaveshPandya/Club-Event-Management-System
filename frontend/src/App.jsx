import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import StudentLogin from "./components/Student/login";
import ClubLogin from "./components/Club/login";
import Otps from "./components/Student/otp";
import Otpc from "./components/Club/otp";
import RegisterStudent from "./components/Student/register.jsx";
import RegisterClub from "./components/Club/register.jsx";
import StudentInfo from "./components/Student/studentinfo.jsx";
import ClubInfo from "./components/Club/clubinfo.jsx";
import AddEvent from "./components/Club/addevent.jsx";
import RegisterEvent from "./components/Student/registerEvent.jsx";
import RegistrationList from "./components/Club/getResponses.jsx";
import GetEvent from "./components/Club/getevents.jsx";
import MyRegisteredEvents from "./components/Student/myEvents.jsx";
import AdminClubApproval from "./components/Admin/adminClubApproval.jsx";
import AdminLogin from "./components/Admin/login.jsx";
import HowToUse from "./components/howtouse.jsx";
import Footer from "./components/footer.jsx";
import Navbar from "./components/navbar.jsx";
import ClubNavbar from "./components/Club/clubNavbar.jsx";
import StudentNavbar from "./components/Student/studentNavbar.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import ChatBot from "./components/chatbot.jsx";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const syncRole = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", syncRole);
    return () => window.removeEventListener("storage", syncRole);
  }, []);
  return (
    <>
      {role === "club" ? (
        <ClubNavbar />
      ) : role === "student" ? (
        <StudentNavbar />
      ) : (
        <Navbar />
      )}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/howtouse" element={<HowToUse />} />
        <Route path="/student/register" element={<RegisterStudent />} />
        <Route path="/club/register" element={<RegisterClub />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/club/login" element={<ClubLogin />} />

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/info" element={<StudentInfo />} />
          <Route path="/student/myevents" element={<MyRegisteredEvents />} />
          <Route path="/events/:eventId/register" element={<RegisterEvent />} />
          <Route path="/student/otp" element={<Otps />} />
        </Route>

        {/* Club Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["club"]} />}>
          <Route path="/club/info" element={<ClubInfo />} />
          <Route path="/club/addevent" element={<AddEvent />} />
          <Route
            path="/events/:eventId/registrations"
            element={<RegistrationList />}
          />
          <Route path="/events" element={<GetEvent />} />
          <Route path="/club/otp" element={<Otpc />} />
        </Route>
        <Route path="/admin/approve-clubs" element={<AdminClubApproval />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
