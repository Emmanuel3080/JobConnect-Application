const Job = require("../Model/JobModel")


const addJob = async (req, res, next) => {

    // const { postedBy } = req.body

    const recruiterId = req?.user?._id
    try {
        const job = await Job.create({ ...req.body, postedBy: recruiterId })


        if (!job) {
            return res.status(401).json({
                Message: "Unable to Create Job",
                Status: "Error"
            })
        }

        return res.status(201).json({
            Message: "Job Created Successfully",
            Status: "Success",
            job
        })

    } catch (error) {
        console.log(error);
        next(error)

    }
}

const jobsAdded = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate({
            path: "postedBy",
            select: "name email phoneNumber companyName"
        })

        if (!jobs) {
            return res.status(401).json({
                Message: "Unable to Fetch Jobs",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Jobs Fetched Successfully",
            Status: "Success",
            No_Of_Jobs: jobs.length,
            jobs
        })
    }
    catch (error) {
        console.log(error);
        next(error)
    }
}



const getJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findById(jobId).populate({
            path: "postedBy",
            select: "name email phoneNumber companyName"
        })
        if (!job) {
            return res.status(400).json({
                Message: "Job Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Job Fetched Successfully",
            Status: "Success",
            job
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}

const updateJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findOneAndUpdate({ _id: jobId },
            { ...req.body },
            { returnDocument: 'after' })
        if (!job) {
            return res.status(400).json({
                Message: "Job Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Job Updated Successfully",
            Status: "Success",
            updatedJob: job
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}

const deleteJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const job = await Job.findByIdAndDelete(jobId)
        if (!job) {
            return res.status(400).json({
                Message: "Job Not Found",
                Status: "Error"
            })
        }
        return res.status(200).json({
            Message: "Job Deleted Successfully",
            Status: "Success",
        })

    } catch (error) {
        console.log(error);
        next(error)

    }
}



const getRecruiterJobs = async (req, res, next) => {
    // const { userId } = req.params
    const { recruiterId } = req.params
    try {
        const myJobs = await Job.find({ postedBy: recruiterId })
        if (!myJobs) {
            return res.status(400).json({
                Message: "Unable to Fetch Jobs",
                Status: "Error"
            })
        }

        if (!myJobs || myJobs.length == 0) {
            return res.status(401).json({
                Message: "You haven't posted any Jobs yet, Failed to fetch Jobs",
                Status: "Error",
            });
        }

        return res.status(200).json({
            Message: "All Jobs Posted by this Recruiter",
            Status: "Success",
            No_Of_Jobs: myJobs.length,
            myJobs
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}



const deleteAllJobs = async (req, res, next) => {
    try {
        const job = await Job.deleteMany({})
        return res.status(400).json({
            Message: "All Jobs Deleted Successfully",
            Status: "Status",
            job
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}
module.exports = {
    addJob,
    getJob,
    jobsAdded,
    updateJob,
    deleteJob,
    deleteAllJobs,
    getRecruiterJobs
}