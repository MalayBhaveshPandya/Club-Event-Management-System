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

  if (loading) return <p>Loading registrations...</p>;
  if (!registrations.length) return <p>No registrations yet.</p>;

  return (
    <div>
      <h3>Registrants ({registrations.length})</h3>
      <ul>
        {registrations.map((reg, idx) => (
          <li key={reg._id || idx} style={{ marginBottom: "10px" }}>
            <b>{reg.registrant?.name}</b> ({reg.registrant?.email})
            <br />
            {Object.entries(reg.responses).map(([label, value]) => (
              <span key={label}>
                <b>{label}:</b> {value}{" "}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationList;
