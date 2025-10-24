import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
const clubLogin = () => {
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/clubs/clublogin",
        {
          email,
          password,
        }
      );
      console.log(response.data);
      const token = response.data.authToken;

      // Store token in localStorage
      localStorage.setItem("token", token);
      navigate("/club/info");
    } catch (error) {
      console.error(error);
    }
  };
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <div>
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
    </div>
  );
};

export default clubLogin;
