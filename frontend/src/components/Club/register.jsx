import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterClub = () => {
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/clubs/createclubs",
      formData
    );

    const email = formData.get("email");
    localStorage.setItem("email", email);
    console.log("Club registered:", response.data);
    navigate("/club/otp");
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Club Name" required />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
        />
        <input type="file" name="logo" placeholder="Logo" required />
        <input
          type="number"
          name="membersCount"
          placeholder="Members Count"
          required
        />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit">Register Club</button>
      </form>
    </div>
  );
};

export default RegisterClub;
