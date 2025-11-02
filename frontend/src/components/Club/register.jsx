import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterClub = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.post("http://localhost:3000/api/clubs/createclubs", formData);
      const email = formData.get("email");
      localStorage.setItem("email", email);
      toast.success("Club Registered! Check Email for OTP.");
      navigate("/club/otp");
    } catch (error) {
      toast.error("Club Registration Failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
        style={{ minWidth: 350 }}
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-bold mb-6 text-indigo-700">
          Register Club
        </h3>
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="name"
          placeholder="Club Name"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="description"
          placeholder="Description"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="file"
          name="logo"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="number"
          name="membersCount"
          placeholder="Members Count"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Register Club
        </button>
      </form>
    </div>
  );
};

export default RegisterClub;
