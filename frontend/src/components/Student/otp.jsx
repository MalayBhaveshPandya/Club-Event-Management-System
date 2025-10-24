import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Otps = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem("email");
      const response = await axios.post(
        "http://localhost:3000/api/student/verifyotp",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      navigate("/student/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="hidden"
          name="email"
          value={localStorage.getItem("email")}
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default Otps;
