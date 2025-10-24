import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentInfo = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please log in first.");

        const response = await axios.get("http://localhost:3000/api/student/getstudent", {
          headers: { Authorization: `Bearer ${token}` }
        });

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

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Student Info</h1>
      {student && (
        <>
          <h2>{student.name}</h2>
          <p>Email: {student.email}</p>
          <p>SAP ID: {student.sapid}</p>
          <p>Department: {student.department}</p>
          <p>Division: {student.division}</p>
          <p>Roll No: {student.rollno}</p>
          <p>Year: {student.year}</p>
        </>
      )}
    </div>
  );
};

export default StudentInfo;

