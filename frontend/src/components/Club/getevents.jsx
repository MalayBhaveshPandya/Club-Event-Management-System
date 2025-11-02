import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/clubs/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data || []);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClubEvents();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-500">Loading events...</span>
      </div>
    );
  if (events.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-500">No events found for your club.</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-2">
      <h2 className="text-2xl font-bold mb-8 text-indigo-700 text-center">
        Club Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              {event.title}
            </h3>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </p>
            <p>
              <strong>Description:</strong> {event.description}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            {event.poster && (
              <div className="my-2">
                <img
                  src={event.poster}
                  alt="Event Poster"
                  className="max-w-xs rounded"
                />
              </div>
            )}
            <hr className="my-2" />
            <strong className="block mb-1">Organizer Details:</strong>
            {event.organizer ? (
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-700">
                  {event.organizer.name}
                </span>
                {event.organizer.logo && (
                  <img
                    src={event.organizer.logo}
                    alt="Organizer Logo"
                    className="w-9 h-9 rounded-full ml-2"
                  />
                )}
                <div className="flex flex-col ml-2 text-xs text-gray-600">
                  <span>Email: {event.organizer.email}</span>
                  <span>Members: {event.organizer.membersCount}</span>
                  <span>
                    Verified: {event.organizer.isVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-red-500">
                Organizer info not found.
              </span>
            )}
            <button
              onClick={() => navigate(`/events/${event._id}/registrations`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 mt-2 rounded w-full"
            >
              Events Responses
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetEvent;
