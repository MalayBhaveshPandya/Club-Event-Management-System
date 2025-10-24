import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterStudent from "../components/Student/register.jsx";
import RegisterClub from "../components/Club/register.jsx";

export default function Register() {
  return (
    <div>
      <Link to="/student/register" element={<RegisterStudent />}>
        Student Register
      </Link>
      <br />
      <Link to="/club/register" element={<RegisterClub />}>
        Club Register
      </Link>
      <br />
      <Link to="/">Go to Home</Link>
    </div>
  );
}
