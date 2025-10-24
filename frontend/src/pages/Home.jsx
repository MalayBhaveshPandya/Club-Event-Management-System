import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/clubs/getevents");
        setEvents(res.data || []);
        toast.success("Events loaded!");
      } catch (err) {
        toast.error("Could not fetch events!");
      }
    };
    fetchEvents();
  }, []);

  // --- CODE YOU WANT: Button to register ---
  return (
    <div>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map(event => (
          <div key={event._id} style={{ marginBottom: "20px", border: "1px solid #eee", padding: "16px", borderRadius: "8px" }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            {event.poster && (
              <img src={event.poster} alt="Event Poster"
                style={{ maxWidth: "200px", borderRadius: "6px" }} />
            )}
            {event.logo && (
              <img src={event.logo} alt="Club Logo"
                style={{
                  maxWidth: "80px",
                  marginLeft: "12px",
                  borderRadius: "50%",
                  verticalAlign: "middle"
                }} />
            )}
            <hr />
            <strong>Organizer Details:</strong>
            {event.organizer ? (
              <div>
                <span>{event.organizer.name}</span>{" "}
                {event.organizer.logo && (
                  <img src={event.organizer.logo} alt="Organizer Logo" style={{ width: 32, marginLeft: 8 }} />
                )}
                <div>Email: {event.organizer.email}</div>
                <div>Members: {event.organizer.membersCount}</div>
                <div>Verified: {event.organizer.isVerified ? "Yes" : "No"}</div>
              </div>
            ) : (
              <p>Organizer Info Not Found</p>
            )}

            {/* ------- Register Button (this is what you need) -------- */}
            <button
              onClick={() => navigate(`/events/${event._id}/register`)}
              style={{
                marginTop: "16px",
                padding: "8px 20px",
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Register
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;


