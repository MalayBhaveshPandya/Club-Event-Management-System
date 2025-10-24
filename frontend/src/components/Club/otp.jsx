import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

const Otpc = () => {
  const [otp, setOtp] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email=localStorage.getItem("email");
      const response = await axios.post("http://localhost:3000/api/clubs/verifyotp", { email,otp });
      console.log(response.data);
      navigate("/club/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default Otpc;
