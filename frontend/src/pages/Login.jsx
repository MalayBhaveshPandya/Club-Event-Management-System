import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <Link to="/student/login">Student Login</Link>
      <br />
      <Link to="/club/login">Club Login</Link>
    </div>
  );
}
