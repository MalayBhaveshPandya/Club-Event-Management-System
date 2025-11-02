import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import dummyEvents from "../components/Club/dummyData";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/clubs/getevents"
        );
        setEvents([...res.data, ...dummyEvents]);
      } catch (err) {
        toast.error("Could not fetch events!");
        setEvents([...dummyEvents]);
      }
    };
    fetchEvents();
  }, []);

  // Split events based on date
  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
  const pastEvents = events.filter((event) => new Date(event.date) < now);

  // Event Card rendering
  const renderEventCard = (event) => (
    <div
      key={event._id}
      className="max-w-sm w-full rounded overflow-hidden shadow-lg bg-white p-6 mb-4 hover:bg-blue-100"
    >
      <h3 className="text-xl font-bold mb-2 text-blue-700">{event.title}</h3>
      <p className="mb-2 text-gray-800">{event.description}</p>
      <p className="mb-1">
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p className="mb-2">
        <strong>Location:</strong> {event.location}
      </p>
      {event.poster && (
        <img
          src={event.poster}
          alt="Event Poster"
          className="w-200 h-100 mb-3  rounded-[20px] hover:bg-blue-100"
        />
      )}
      {event.logo && (
        <img
          src={event.logo}
          alt="Club Logo"
          className="w-20 h-20 rounded-full mb-3"
        />
      )}
      <hr className="my-2" />
      <strong className="block mb-1">Organizer Details:</strong>
      {event.organizer ? (
        <div className="flex items-center mb-3">
          <span className="text-gray-700">{event.organizer.name}</span>
          {event.organizer.logo && (
            <img
              src={event.organizer.logo}
              alt="Organizer Logo"
              className="w-8 h-8 rounded-full ml-2"
            />
          )}
        </div>
      ) : (
        <p>Organizer Info Not Found</p>
      )}
      <button
        onClick={() => {
          if (role === "student") {
            navigate(`/events/${event._id}/register`);
          } else {
            toast.error("You must be logged in as a student to register.");
          }
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded w-full"
      >
        Register
      </button>
    </div>
  );

  return (
    <>
      {role === "club" && (
        <div className="max-w-xl mx-auto bg-indigo-50 rounded-[20px] shadow p-4 my-6 text-center">
          <h3 className="text-lg font-bold text-indigo-700 mb-2">
            Club Dashboard Quick Links
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/club/info"
              className="bg-blue-100 text-blue-700 px-5 py-2 rounded-[10px] font-semibold hover:bg-blue-200 transition"
            >
              View Club Details
            </Link>
            <Link
              to="/club/addevent"
              className="bg-green-100 text-green-700 px-5 py-2 rounded-[10px] font-semibold hover:bg-green-200 transition"
            >
              Add Event
            </Link>
            <Link
              to="/events"
              className="bg-purple-100 text-purple-700 px-5 py-2 rounded-[10px] font-semibold hover:bg-purple-200 transition"
            >
              View My Events
            </Link>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-10 px-2">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-2">
          EventHub
        </h1>
        <h2 className="text-xl text-gray-700 text-center mb-8">
          Upcoming Events
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-600">No upcoming events.</p>
          ) : (
            upcomingEvents.map(renderEventCard)
          )}
        </div>

        <h2 className="text-xl text-gray-700 text-center my-8">Past Events</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {pastEvents.length === 0 ? (
            <p className="text-center text-gray-600">No past events.</p>
          ) : (
            pastEvents.map(renderEventCard)
          )}
        </div>
        <button
          onClick={() => navigate("/chatbot")}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center z-50 transition"
          aria-label="Open Chatbot"
        >
          {/* Chat icon SVG, you can change to any icon you like */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Home;
