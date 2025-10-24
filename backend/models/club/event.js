// models/event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true 
 },
 title: {
    type: String,
    required: true
 },
  description: {
    type: String, 
    required: true 
 },
  date: { 
    type: Date, 
    required: true
 },
  location: { 
    type: String, 
    required: true
 },
  poster:{
    type:String,
    required:true
 },
  registrationForm: {
    type: [{ 
        label: String, 
        fieldType: String, 
        required: Boolean 
    }], 
    default: [],
  },
});

module.exports = mongoose.model("Event", eventSchema);
