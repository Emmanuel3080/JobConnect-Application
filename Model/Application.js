const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: true
    },
    applicants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmployeeInformation",
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    cvUrl: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
        default: "Pending"
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    }



}, { timestamps: true });


applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });
const applicationModel = mongoose.model("Application", applicationSchema);
module.exports = applicationModel