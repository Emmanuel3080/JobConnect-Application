const express = require("express")
const { SignUp, SignIn, getEmployee, updateEmployee, allEmployee, deleteEmployee, verifyToken } = require("../EmployeeController/Auth")
const isLoggedIn = require("../Middlewares/isLoggedIn")
const { jobsAdded, getJob } = require("../JobPosterController/Job")
const uploadEmployeePicture = require("../DocumentMiddleware/uploadProfile")
const { submitApplication, getEmployeeApplications } = require("../EmployeeController/ApplyJob")
const uploadEmployeeCv = require("../DocumentMiddleware/uploadCv")
const EmployeeRouter = express.Router()

// Accept either "cvUrl" or "profileImage" field name and normalize to req.file
const handleProfileUpload = (req, res, next) => {
    const upload = uploadEmployeePicture.fields([
        { name: "cvUrl", maxCount: 1 },
        { name: "profileImage", maxCount: 1 }
    ]);
    upload(req, res, (err) => {
        if (err) return next(err);
        if (!req.file && req.files) {
            req.file = req.files.profileImage?.[0] || req.files.cvUrl?.[0];
        }
        next();
    });
};

EmployeeRouter.post("/signup", handleProfileUpload, SignUp)
EmployeeRouter.post("/verify_token", verifyToken)

EmployeeRouter.post("/signin", SignIn)
EmployeeRouter.get("/all", isLoggedIn, allEmployee)
EmployeeRouter.delete("/delete/:id", isLoggedIn, deleteEmployee)
EmployeeRouter.get("/:employeeId", isLoggedIn, getEmployee)
EmployeeRouter.patch("/update/:employeeId", isLoggedIn, handleProfileUpload, updateEmployee)


// Jobs
EmployeeRouter.get("/all/jobs", isLoggedIn, jobsAdded)
EmployeeRouter.get("/job/:jobId", isLoggedIn, getJob)

// Apply Jobs
EmployeeRouter.post("/apply_job", isLoggedIn, uploadEmployeeCv.single("cvUrl"), submitApplication)


// Get Applications
EmployeeRouter.get("/job/applications/:employeeId", isLoggedIn, getEmployeeApplications)


module.exports = EmployeeRouter
