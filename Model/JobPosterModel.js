const mongoose = require("mongoose");
const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false
    },
    companyName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "recruiter",
    },
  },
  { timestamps: true }
);

const RecruiterModel = mongoose.model("Recruiter", recruiterSchema);
module.exports = RecruiterModel;