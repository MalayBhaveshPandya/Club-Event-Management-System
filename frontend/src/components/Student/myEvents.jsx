import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/student/myevents",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(res.data || []);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Loading your events...</p>
      </div>
    );
  if (!events.length)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">You have not registered for any events.</p>
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto bg-indigo-50">
      <h2 className="text-2xl font-bold mb-8 text-indigo-700 text-center">
        My Registered Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              {event.title}
            </h3>
            <p className="mb-1">
              <strong>Date:</strong>{" "}
              {event.date ? new Date(event.date).toLocaleString() : "TBD"}
            </p>
            <p className="mb-1">
              <strong>Description:</strong> {event.description}
            </p>
            <p className="mb-1">
              <strong>Location:</strong> {event.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegisteredEvents;
