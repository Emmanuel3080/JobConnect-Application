const cloudinary = require("../Cloudinary/cloudinary");
const applicationModel = require("../Model/Application");
const Job = require("../Model/JobModel");
const applicationMessage = require("../Utils/ApplicationMail");
const mongoose = require("mongoose")

const submitApplication = async (req, res, next) => {
    const applicantId = req?.user?._id
    try {
        const { candidateName, email, phoneNumber, cvUrl, coverLetter, jobId } = req.body


        const imageFile = req.file;
        if (!imageFile) {
            return res.status(401).json({
                Status: "error",
                message: "No CV file uploaded",
            });
        }
        const existing = await applicationModel.findOne({ jobId, email });
        if (existing) {
            return res.status(400).json({
                Message: "You already applied for this job"
            });
        }

        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: imageFile.mimetype === "application/pdf" ? "raw" : "auto",
            folder: "EmployeeCv"
        })


        const applyJob = await applicationModel.create({ ...req.body, cvUrl: uploadResult.secure_url, applicants: applicantId })
        if (!applyJob) {
            return res.status(401).json({
                Message: "Unable to apply",
                Status: "Error"
            })
        }



        const job = await Job.findByIdAndUpdate(
            jobId,
            { $inc: { No_of_Applicant: 1 } },
            { returnDocument: 'after' } // optional, returns the updated doc
        );
        const jobTitle = job.title || "this"


        const applyMessage = await applicationMessage(candidateName, email, job)

        return res.status(201).json({
            Message: `Successfully applied for the ${jobTitle}position!`,
            Status: "Success",
            applyMessage,
            job,
            applyJob
        })

    } catch (error) {
        if (error.code === 11000) {
            const job = await Job.findById(req.body.jobId)
            const jobTitle = job?.title || "this"
            return res.status(400).json({
                Message: `You already applied for this ${jobTitle} position`,
                Status: "Error"
            })

        }
    }
}

const getApplicationByJob = async (req, res, next) => {
    const { jobId } = req.params
    if (!jobId) {
        return res.status(400).json({
            Message: "Job ID is required",
            Status: "Error"
        });
    }
    try {
        const applications = await applicationModel.find({ jobId })
        if (!applications) {
            return res.status(400).json({
                Message: "Error Fetching Applicant",
                Status: "Error"
            });
        }
        return res.status(200).json({
            Status: "success",
            total: applications.length,
            applications
        });
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const getEmployeeApplications = async (req, res, next) => {


    const { employeeId } = req.params;

    try {

        const applications = await applicationModel.find({ applicants: employeeId }).populate("jobId")


        if (applications.length === 0) {
            return res.status(404).json({
                Message: "No applications found",
                Status: "Error"
            });
        }

        return res.status(200).json({
            message: "Applications fetched successfully",
            status: "Success",
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};
module.exports = {
    submitApplication,
    getApplicationByJob,
    getEmployeeApplications
}