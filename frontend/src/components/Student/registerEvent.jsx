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

  if (!event)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-gray-500">Loading event information...</div>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-indigo-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">
          Register for {event.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{event.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {event.registrationForm && event.registrationForm.length > 0 ? (
            event.registrationForm.map((field, i) => (
              <div key={i} className="">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {(field.fieldType === "text" ||
                  field.fieldType === "email" ||
                  field.fieldType === "number") && (
                  <input
                    type={field.fieldType}
                    required={field.required}
                    value={responses[field.label] || ""}
                    onChange={(e) => handleInput(field.label, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No registration fields defined.
            </p>
          )}
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Register
            </button>
          </div>{" "}
        </form>
      </div>
    </div>
  );
};

export default RegisterEvent;
