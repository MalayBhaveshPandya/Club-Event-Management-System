import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddEvent = () => {
  const [fields, setFields] = useState([
    { label: "", fieldType: "text", required: false },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    poster: null,
  });
  const [club, setClub] = useState(null);
  const [loadingClub, setLoadingClub] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingClub(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/api/clubs/getclub", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClub(res.data);
      } catch (err) {
        console.error("Failed to fetch club details", err);
      } finally {
        setLoadingClub(false);
      }
    };
    fetchClub();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  const handleFieldChange = (index, e) => {
    const newFields = [...fields];
    newFields[index][e.target.name] =
      e.target.name === "required" ? e.target.checked : e.target.value;
    setFields(newFields);
  };

  const addField = () =>
    setFields([...fields, { label: "", fieldType: "text", required: false }]);

  const removeField = (index) =>
    setFields(fields.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("location", formData.location);
      if (formData.poster) data.append("poster", formData.poster);
      data.append("registrationForm", JSON.stringify(fields));
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first!");
        return;
      }
      await axios.post("http://localhost:3000/api/clubs/addevents", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        poster: null,
      });
      setFields([{ label: "", fieldType: "text", required: false }]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event!");
    }
  };

  if (loadingClub) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse bg-white shadow rounded p-8 w-full max-w-lg">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded shadow max-w-lg w-full">
          <p className="text-yellow-700 font-medium">
            You must be logged in as a club to create events.
          </p>
        </div>
      </div>
    );
  }

  if (!club.isApproved) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded shadow max-w-lg w-full">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Club pending approval
          </h3>
          <p className="text-sm text-red-600">
            Your club is not yet approved by an admin. You cannot create events
            until your club is approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Create a New Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Event Title
            </label>
            <input
              className="block w-full border border-gray-300 rounded py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full border border-gray-300 rounded py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <input
                className="block w-full border border-gray-300 rounded py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                className="block w-full border border-gray-300 rounded py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="location"
                placeholder="Event Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Event Poster
            </label>
            <input
              className="block mt-1"
              type="file"
              name="poster"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2 text-indigo-700">
              Registration Form Fields
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Build the form students will fill when registering.
            </p>
            {fields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-3 items-center mb-3"
              >
                <input
                  type="text"
                  name="label"
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="col-span-2 border border-gray-300 rounded py-2 px-3"
                  required
                />
                <select
                  name="fieldType"
                  value={field.fieldType}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="border border-gray-300 rounded py-2 px-2"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="required"
                    checked={field.required}
                    onChange={(e) => handleFieldChange(index, e)}
                  />
                  <span className="text-sm">Required</span>
                </label>
                <div className="col-span-4">
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="mt-1 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Field
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow text-white bg-green-600 hover:bg-green-700"
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
