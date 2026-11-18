const Job = require("../Model/JobModel")


const addJob = async (req, res, next) => {
    const recruiterId = req?.user?._id
    try {
        const {
            title,
            description,
            requirements,
            location,
            jobType,
            salary,
            company,
            applicationDeadline,
            isActive,
            category,
            skills,
            remote
        } = req.body

        const job = await Job.create({
            title,
            description,
            requirements,
            location,
            jobType,
            salary,
            company,
            applicationDeadline,
            isActive,
            category,
            skills,
            remote,
            postedBy: recruiterId
        })

        if (!job) {
            return res.status(400).json({
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
            return res.status(404).json({
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
            return res.status(404).json({
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
        const existingJob = await Job.findById(jobId)
        if (!existingJob) {
            return res.status(404).json({
                Message: "Job Not Found",
                Status: "Error"
            })
        }

        if (req.user && existingJob.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                Message: "You are not authorized to update this job",
                Status: "Error"
            })
        }

        const allowedFields = [
            "title",
            "description",
            "requirements",
            "location",
            "jobType",
            "salary",
            "company",
            "applicationDeadline",
            "isActive",
            "category",
            "skills",
            "remote"
        ];
        const updateData = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }

        const job = await Job.findOneAndUpdate(
            { _id: jobId, postedBy: req.user._id },
            updateData,
            { returnDocument: 'after', runValidators: true }
        )

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
        const existingJob = await Job.findById(jobId)
        if (!existingJob) {
            return res.status(404).json({
                Message: "Job Not Found",
                Status: "Error"
            })
        }

        if (req.user && existingJob.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                Message: "You are not authorized to delete this job",
                Status: "Error"
            })
        }

        await Job.findOneAndDelete({ _id: jobId, postedBy: req.user._id })

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
    const { recruiterId } = req.params
    try {
        const myJobs = await Job.find({ postedBy: recruiterId })
        if (!myJobs || myJobs.length === 0) {
            return res.status(404).json({
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
        const recruiterId = req?.user?._id
        const job = await Job.deleteMany({ postedBy: recruiterId })
        return res.status(200).json({
            Message: "All Jobs Deleted Successfully",
            Status: "Success",
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
