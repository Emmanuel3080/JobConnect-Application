const mongoose = require("mongoose")
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profileImage: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Skills: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "employee"
    }

}, { timestamps: true })

const EmployeeModel = mongoose.model("EmployeeInformation", employeeSchema)
module.exports = EmployeeModel