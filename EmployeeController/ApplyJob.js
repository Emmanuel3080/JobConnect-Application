const cloudinary = require("../Cloudinary/cloudinary");
const applicationModel = require("../Model/Application");
const Job = require("../Model/JobModel");
const applicationMessage = require("../Utils/ApplicationMail");

const submitApplication = async (req, res, next) => {
    const applicantId = req?.user?._id
    try {
        const { candidateName, email, phoneNumber, coverLetter, jobId } = req.body

        if (!candidateName || !email || !phoneNumber || !jobId) {
            return res.status(400).json({
                Status: "Error",
                Message: "Candidate name, email, phone number, and job ID are required"
            });
        }

        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({
                Status: "error",
                Message: "No CV file uploaded",
                message: "No CV file uploaded",
            });
        }

        const targetJob = await Job.findById(jobId);
        if (!targetJob) {
            return res.status(404).json({
                Status: "Error",
                Message: "Job not found"
            });
        }

        const existing = await applicationModel.findOne({ jobId, email });
        if (existing) {
            return res.status(400).json({
                Status: "Error",
                Message: "You already applied for this job"
            });
        }

        // uploadEmployeeCv middleware already uploads to Cloudinary and sets imageFile.path to the URL
        let cvUrl = imageFile.path;
        if (cvUrl && !/^https?:\/\//i.test(cvUrl)) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: imageFile.mimetype === "application/pdf" ? "raw" : "auto",
                folder: "EmployeeCv"
            });
            cvUrl = uploadResult.secure_url;
        }

        const applyJob = await applicationModel.create({
            candidateName,
            email,
            phoneNumber,
            coverLetter,
            jobId,
            cvUrl,
            applicants: applicantId
        })
        if (!applyJob) {
            return res.status(400).json({
                Message: "Unable to apply",
                Status: "Error"
            })
        }

        const job = await Job.findByIdAndUpdate(
            jobId,
            {
                $inc: { No_of_Applicant: 1 },
                $push: {
                    applications: {
                        applicant: applicantId,
                        dateApplied: new Date(),
                        status: "applied"
                    }
                }
            },
            { returnDocument: 'after' }
        );
        const jobTitle = job?.title || targetJob.title || "this"

        let applyMessage = null;
        try {
            applyMessage = await applicationMessage(candidateName, email, job || targetJob)
        } catch (mailError) {
            console.error("Failed to send application confirmation email:", mailError);
        }

        return res.status(201).json({
            Message: `Successfully applied for the ${jobTitle} position!`,
            Status: "Success",
            applyMessage,
            job,
            applyJob
        })

    } catch (error) {
        if (error.code === 11000) {
            try {
                const job = await Job.findById(req.body.jobId)
                const jobTitle = job?.title || "this"
                return res.status(400).json({
                    Message: `You already applied for this ${jobTitle} position`,
                    Status: "Error"
                })
            } catch (innerErr) {
                return next(innerErr)
            }
        }
        console.error(error);
        next(error);
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
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                Message: "Job Not Found",
                Status: "Error"
            });
        }

        if (req.user && job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                Message: "You are not authorized to view applicants for this job",
                Status: "Error"
            });
        }

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

    if (req.user && req.user._id.toString() !== employeeId) {
        return res.status(403).json({
            Message: "You are not authorized to view these applications",
            Status: "Error"
        });
    }

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
