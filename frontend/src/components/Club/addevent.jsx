import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddEvent = () => {
  const [fields, setFields] = useState([{ label: "", fieldType: "text", required: false }]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    poster: null,
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] }); // works for both 'logo' and 'poster'

  const handleFieldChange = (index, e) => {
    const newFields = [...fields];
    newFields[index][e.target.name] =
      e.target.name === "required" ? e.target.checked : e.target.value;
    setFields(newFields);
  };

  const addField = () => setFields([...fields, { label: "", fieldType: "text", required: false }]);

  const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // append regular inputs
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("location", formData.location);

      // append file
      if (formData.poster) data.append("poster", formData.poster);

      // append dynamic fields (converted to JSON string)
      data.append("registrationForm", JSON.stringify(fields));

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      await axios.post("http://localhost:3000/api/clubs/addevents", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event created successfully!");
      setFormData({ title: "", description: "", date: "", location: "", logo: null, poster: null });
      setFields([{ label: "", fieldType: "text", required: false }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a New Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <label>Upload Event Poster</label>
        <input type="file" name="poster" onChange={handleFileChange} required />

        <h3>Registration Form Fields</h3>
        {fields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              name="label"
              placeholder="Label"
              value={field.label}
              onChange={(e) => handleFieldChange(index, e)}
            />
            <select
              name="fieldType"
              value={field.fieldType}
              onChange={(e) => handleFieldChange(index, e)}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>
            <label>
              Required:
              <input
                type="checkbox"
                name="required"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, e)}
              />
            </label>
            <button type="button" onClick={() => removeField(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addField}>
          Add Field
        </button>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default AddEvent;


