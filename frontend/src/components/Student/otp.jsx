import React, { useState } from "react";
import axios from "axios";
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
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
        style={{ minWidth: 320 }}
      >
        <h3 className="text-xl font-bold mb-6 text-indigo-700">
          OTP Verification
        </h3>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="border rounded w-full py-2 px-3 mb-4 focus:outline-none"
        />
        <input
          type="hidden"
          name="email"
          value={localStorage.getItem("email")}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default Otps;
