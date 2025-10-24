import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
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

function App() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/otp" element={<Otps />} />
        <Route path="/club/otp" element={<Otpc />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/register" element={<RegisterStudent />} />
        <Route path="/club/register" element={<RegisterClub />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/club/login" element={<ClubLogin />} />
        <Route path="/student/info" element={<StudentInfo />} />
        <Route path="/club/info" element={<ClubInfo />} />
        <Route path="/club/addevent" element={<AddEvent />} />
        <Route path="/events/:eventId/register" element={<RegisterEvent />} />
        <Route path="/events" element={<GetEvent />} />
        <Route
          path="/events/:eventId/registrations"
          element={<RegistrationList />}
        />
      </Routes>
    </>
  );
}

export default App;
