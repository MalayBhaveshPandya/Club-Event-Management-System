const mongoose=require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Must match the actual model name exactly
    required: true
  },
  registrant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  responses: {
    type: Object,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});


module.exports=mongoose.model("EventRegistration",eventRegistrationSchema);