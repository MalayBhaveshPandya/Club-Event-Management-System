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
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
        style={{ minWidth: 350 }}
      >
        <h3 className="text-xl font-bold mb-6 text-indigo-700">
          Student Registration
        </h3>
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="name"
          placeholder="Name"
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
          type="text"
          name="sapid"
          placeholder="SAP ID"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="department"
          placeholder="Department"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="division"
          placeholder="Division"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="rollno"
          placeholder="Roll No"
          required
        />
        <input
          className="border rounded w-full py-2 px-3 mb-3"
          type="text"
          name="year"
          placeholder="Year"
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
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterStudent;
