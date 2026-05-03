const express = require("express")
const { SignUp, SignIn, getEmployee, updateEmployee, allEmployee, deleteEmployee, verifyToken } = require("../EmployeeController/Auth")
const isLoggedIn = require("../Middlewares/isLoggedIn")
const { jobsAdded, getJob } = require("../JobPosterController/Job")
const uploadEmployeePicture = require("../DocumentMiddleware/uploadProfile")
const { submitApplication, getApplicationByJob, getEmployeeAppications, getEmployeeApplications } = require("../EmployeeController/ApplyJob")
const uploadEmployeeCv = require("../DocumentMiddleware/uploadCv")
const EmployeeRouter = express.Router()



EmployeeRouter.post("/signup", uploadEmployeePicture.single("cvUrl"), SignUp)
EmployeeRouter.post("/verify_token", verifyToken)

EmployeeRouter.post("/signin", SignIn)
EmployeeRouter.get("/all", isLoggedIn, allEmployee)
EmployeeRouter.delete("/delete/:id", isLoggedIn, deleteEmployee)
EmployeeRouter.get("/:employeeId", isLoggedIn, getEmployee)
EmployeeRouter.patch("/update/:employeeId", isLoggedIn, uploadEmployeePicture.single("cvUrl"), updateEmployee)


// Jobs
EmployeeRouter.get("/all/jobs", isLoggedIn, jobsAdded)
EmployeeRouter.get("/job/:jobId", isLoggedIn, getJob)

// Apply Jobs
EmployeeRouter.post("/apply_job", isLoggedIn, uploadEmployeeCv.single("cvUrl"), submitApplication)


// Get Applications
EmployeeRouter.get("/job/applications/:employeeId", isLoggedIn, getEmployeeApplications)




module.exports = EmployeeRouter