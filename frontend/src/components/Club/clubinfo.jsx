import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ClubInfo = () => {
  const [club, setClub] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClubInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in first.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/clubs/getclub", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClub(res.data);
        toast.success("Club info loaded!");
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch club details";
        toast.error(message);
      }
    };

    fetchClubInfo();
  }, []);

  if (!club)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Loading club data...</p>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Club Information</h1>
      <h2>{club.name}</h2>
      <p>
        <strong>Description:</strong> {club.description}
      </p>
      <p>
        <strong>Email:</strong> {club.email}
      </p>
      <p>
        <strong>Members Count:</strong> {club.membersCount}
      </p>
      {club.logo && (
        <div>
          <strong>Logo:</strong>
          <br />
          <img
            src={club.logo}
            alt="Club Logo"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <p>
        <strong>Verified:</strong>{" "}
        {club.isVerified ? "Yes ✅" : "No ❌ (Awaiting verification)"}
      </p>

      <Link
        to="/club/addevent"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Add Event
      </Link>
      <button
        onClick={() => navigate("/events")}
        style={{
          display: "inline-block",
          marginTop: "20px",
          marginLeft: "20px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Events
      </button>
    </div>
  );
};

export default ClubInfo;
