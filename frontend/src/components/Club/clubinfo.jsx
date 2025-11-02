import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClubInfo = () => {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please log in first.");
        const response = await axios.get(
          "http://localhost:3000/api/clubs/getclub",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClub(response.data);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Loading club data...</p>
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
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Club Info</h1>
      {club && (
        <>
          <div className="flex items-center gap-6 mb-4">
            {club.logo && (
              <img
                src={club.logo}
                alt="Club Logo"
                className="w-20 h-20 rounded-md object-cover shadow"
              />
            )}
            <h2 className="font-semibold text-lg">{club.name}</h2>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span> {club.email}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Description:</span>{" "}
            {club.description}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Members Count:</span>{" "}
            {club.membersCount}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Verified:</span>{" "}
            {club.isVerified ? "Yes ✅" : "No ❌"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Approved:</span>{" "}
            {club.isApproved ? "Yes ✅" : "No ❌"}
          </div>
          <button
            onClick={() => navigate("/events")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            My Events
          </button>
          {club.isApproved ? (
            <button
              onClick={() => navigate("/club/addevent")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
            >
              Add Event
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full mt-4 cursor-not-allowed"
            >
              Add Event (waiting approval)
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ClubInfo;
