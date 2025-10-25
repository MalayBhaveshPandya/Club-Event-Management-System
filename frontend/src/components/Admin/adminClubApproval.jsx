import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminClubApproval = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/admin/all-clubs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClubs(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleApprove = async (clubId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/admin/approve-club/${clubId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Club approved!");
      setClubs(
        clubs.map((club) =>
          club._id === clubId ? { ...club, isApproved: true } : club
        )
      );
    } catch (err) {
      toast.error("Failed to approve club");
    }
  };

  const handleReject = async (clubId) => {
    if (
      !window.confirm("Are you sure you want to reject and delete this club?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/admin/reject-club/${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Club rejected and deleted!");
      setClubs(clubs.filter((club) => club._id !== clubId));
    } catch (err) {
      toast.error("Failed to reject club");
    }
  };

  if (loading) return <p>Loading clubs...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Club Approval Dashboard</h2>
      {clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        clubs.map((club) => (
          <div
            key={club._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{club.name}</h3>
            <p>
              <strong>Email:</strong> {club.email}
            </p>
            <p>
              <strong>Description:</strong> {club.description}
            </p>
            <p>
              <strong>Members Count:</strong> {club.membersCount}
            </p>
            <p>
              <strong>Verified:</strong> {club.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Approved:</strong> {club.isApproved ? "✅ Yes" : "❌ No"}
            </p>
            {club.logo && (
              <img
                src={club.logo}
                alt="Logo"
                style={{ width: "60px", borderRadius: "50%" }}
              />
            )}
            <div style={{ marginTop: "10px" }}>
              {!club.isApproved && (
                <>
                  <button
                    onClick={() => handleApprove(club._id)}
                    style={{
                      padding: "8px 16px",
                      marginRight: "10px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(club._id)}
                    style={{
                      padding: "8px 16px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Reject & Delete
                  </button>
                </>
              )}
              {club.isApproved && (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ✅ Already Approved
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminClubApproval;
