import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const RegisterEvent = () => {
  const { eventId } = useParams(); // get from URL, e.g., /events/:eventId/register
  const [event, setEvent] = useState(null);
  const [responses, setResponses] = useState({});

  // Fetch event details (to get registrationForm)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/student/event/${eventId}`
        );
        setEvent(res.data);
      } catch (err) {
        toast.error("Could not fetch event.");
      }
    };
    fetchEvent();
  }, [eventId]);

  // Handle dynamic registration field input
  const handleInput = (label, value) => {
    setResponses((prev) => ({ ...prev, [label]: value }));
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login!");

    try {
      await axios.post(
        `http://localhost:3000/api/student/events/${eventId}/register`,
        { responses }, // matches backend expectation
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Registration successful!");
      setResponses({});
    } catch (err) {
      // Show server error or field error
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to register";
      toast.error(msg);
    }
  };

  if (!event) return <div>Loading event information...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Register for {event.title}</h2>
      <p>{event.description}</p>
      <form onSubmit={handleSubmit}>
        {event.registrationForm && event.registrationForm.length > 0 ? (
          event.registrationForm.map((field, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <label>
                {field.label}
                {field.required && " *"}
                <br />
                {field.fieldType === "text" ||
                field.fieldType === "email" ||
                field.fieldType === "number" ? (
                  <input
                    type={field.fieldType}
                    required={field.required}
                    value={responses[field.label] || ""}
                    onChange={(e) => handleInput(field.label, e.target.value)}
                    style={{ marginTop: "3px" }}
                  />
                ) : null}
              </label>
            </div>
          ))
        ) : (
          <p>No registration fields defined.</p>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterEvent;
