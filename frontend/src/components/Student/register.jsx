import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      sapid: e.target.sapid.value,
      department: e.target.department.value,
      division: e.target.division.value,
      rollno: e.target.rollno.value,
      year: e.target.year.value,
      password: e.target.password.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/student/createstudent",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      await localStorage.setItem("email", response.data.email);
      navigate("/student/otp");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="sapid" placeholder="SAP ID" required />
        <input
          type="text"
          name="department"
          placeholder="Department"
          required
        />
        <input type="text" name="division" placeholder="Division" required />
        <input type="text" name="rollno" placeholder="Roll No" required />
        <input type="text" name="year" placeholder="Year" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
