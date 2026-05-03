const express = require("express")
const { SignUp, SignIn, verifyCompanyToken, getRecruiter, allRecruiter } = require("../JobPosterController/JobPosterAuth")
const IsRecruiterloggedIn = require("../RecruiterMiddleware/isLoggedIn")
const { addJob, jobsAdded, getJob, updateJob, deleteJob, getRecruiterJobs, deleteAllJobs } = require("../JobPosterController/Job")
const { getApplicationByJob } = require("../EmployeeController/ApplyJob")

const JobPosterRouter = express.Router()



// Auth => Recruiter
JobPosterRouter.post("/signup", SignUp)
JobPosterRouter.post("/signin", SignIn)
JobPosterRouter.post("/verify_token", verifyCompanyToken)
JobPosterRouter.get("/recruiter/:recruiterId", IsRecruiterloggedIn, getRecruiter)
JobPosterRouter.get("/all_recruiters", IsRecruiterloggedIn, allRecruiter)


// Jobs Routes
JobPosterRouter.get("/jobs", IsRecruiterloggedIn, jobsAdded)
JobPosterRouter.post("/add_job", IsRecruiterloggedIn, addJob)
JobPosterRouter.get("/job/:jobId", IsRecruiterloggedIn, getJob)
JobPosterRouter.patch("/job/update/:jobId", IsRecruiterloggedIn, updateJob)
JobPosterRouter.delete("/job/delete/:jobId", IsRecruiterloggedIn, deleteJob)
JobPosterRouter.get("/jobs/:recruiterId", IsRecruiterloggedIn, getRecruiterJobs)
JobPosterRouter.delete("/jobs/delete", IsRecruiterloggedIn,deleteAllJobs)


JobPosterRouter.get("/jobs/applicants/:jobId", IsRecruiterloggedIn, getApplicationByJob)




module.exports = JobPosterRouter