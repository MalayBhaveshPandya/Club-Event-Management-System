import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/api/clubs/events/${eventId}/registrations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRegistrations(res.data || []);
      } catch (err) {
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [eventId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-500">Loading registrations...</span>
      </div>
    );
  if (!registrations.length)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-gray-500">No registrations yet.</span>
      </div>
    );

  // Table headers (dynamic from responses)
  let fields = [];
  if (registrations.length > 0) {
    fields = Object.keys(registrations[0].responses);
  }

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-2">
      <div className="max-w-5xl mx-auto bg-white rounded shadow p-8">
        <h3 className="text-2xl font-bold mb-8 text-indigo-700 text-center">
          Registrants ({registrations.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-indigo-50">
                {fields.map((field) => (
                  <th
                    key={field}
                    className="py-2 px-4 border-b text-left font-semibold text-indigo-800"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, idx) => (
                <tr
                  key={reg._id || idx}
                  className="hover:bg-gray-100 transition"
                >
                  {fields.map((field) => (
                    <td key={field} className="py-2 px-4 border-b">
                      {reg.responses[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationList;
