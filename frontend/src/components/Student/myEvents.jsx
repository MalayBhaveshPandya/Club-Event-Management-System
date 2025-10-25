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

  if (loading) return <p>Loading your events...</p>;
  //   if (!events.length) return <p>You have not registered for any events.</p>;

  return (
    <div>
      <h2>My Registered Events</h2>
      {events.map((event) => (
        <div
          key={event._id}
          style={{
            boxShadow: "0 0 10px #eee",
            margin: "1em 0",
            padding: 18,
            borderRadius: 7,
          }}
        >
          <h3>{event.title}</h3>
          <p>
            <strong>Date:</strong>{" "}
            {event.date ? new Date(event.date).toLocaleString() : "TBD"}
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          {event.organizer && (
            <div>
              <strong>Organizer:</strong> {event.organizer.name} (
              {event.organizer.email})
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyRegisteredEvents;
