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

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found for your club.</p>;

  return (
    <div>
      <h2>Club Events</h2>
      {events.map((event) => (
        <div
          key={event._id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "18px",
            padding: "18px",
            borderRadius: "6px",
            boxShadow: "0 0 10px #eee",
          }}
        >
          <h3>{event.title}</h3>
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
            <div>
              <img
                src={event.poster}
                alt="Event Poster"
                style={{ maxWidth: "240px", borderRadius: "7px" }}
              />
            </div>
          )}
          <hr />
          <strong>Organizer Details:</strong>
          {event.organizer ? (
            <div>
              <span>
                <b>{event.organizer.name}</b>
              </span>
              {event.organizer.logo && (
                <img
                  src={event.organizer.logo}
                  alt="Organizer Logo"
                  style={{
                    width: "45px",
                    marginLeft: "10px",
                    borderRadius: "50%",
                    verticalAlign: "middle",
                  }}
                />
              )}
              <div>Email: {event.organizer.email}</div>
              <div>Members: {event.organizer.membersCount}</div>
              <div>Verified: {event.organizer.isVerified ? "Yes" : "No"}</div>
            </div>
          ) : (
            <span>Organizer info not found.</span>
          )}
          <button
            onClick={() => navigate(`/events/${event._id}/registrations`)}
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
            Events Responses
          </button>
        </div>
      ))}
    </div>
  );
};

export default GetEvent;
