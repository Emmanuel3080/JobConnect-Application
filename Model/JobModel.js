const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time"
    },
    salary: {
        type: String
    },
    company: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    applicationDeadline: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    category: {
        type: String
    },
    skills: {
        type: [String],
        default: []
    },
    No_of_Applicant: {
        type: Number,
        default: 0
    },
    applications: [{
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeInformation" },
        dateApplied: { type: Date, default: Date.now },
        status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" }
    }],
    remote: {
        type: Boolean,
        default: false
    }
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;