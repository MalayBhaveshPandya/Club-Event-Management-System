import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Request to backend for login
      const response = await axios.post("http://localhost:3000/api/student/studentlogin", {
        email,
        password,
      });

      // Extract token from backend response
      const token = response.data.authToken;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Optionally store user email or info
      localStorage.setItem("email", email);

      console.log("Login Success:", response.data);

      // Redirect to student info page
      navigate("/student/info");
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default StudentLogin;

