import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentInfo = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please log in first.");
        const response = await axios.get(
          "http://localhost:3000/api/student/getstudent",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudent(response.data);
      } catch (err) {
        console.error("Error fetching student info:", err);
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Loading student data...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow bg-indigo-50">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Student Info</h1>
      {student && (
        <>
          <h2 className="font-semibold text-lg mb-2">{student.name}</h2>
          <div className="mb-2">
            <span className="font-semibold">Email:</span> {student.email}
          </div>
          <div className="mb-2">
            <span className="font-semibold">SAP ID:</span> {student.sapid}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Department:</span>{" "}
            {student.department}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Division:</span> {student.division}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Roll No:</span> {student.rollno}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Year:</span> {student.year}
          </div>
          <button
            onClick={() => navigate("/student/myevents")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            My Events
          </button>
        </>
      )}
    </div>
  );
};

export default StudentInfo;
