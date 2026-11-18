const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const RecruiterModel = require("../Model/JobPosterModel")

const SignUp = async (req, res, next) => {
    const { name, email, password, companyName, phoneNumber } = req.body
    if (!name || !email || !password || !companyName) {
        return res.status(400).json({
            Message: "All fields are Required",
            Status: "Error"
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const Recruiter = await RecruiterModel.create({
            name,
            email,
            companyName,
            phoneNumber,
            password: hashedPassword,
            role: "recruiter"
        })
        if (!Recruiter) {
            return res.status(400).json({
                Message: "Failed to Create Recruiter profile",
                Status: "Error"
            })
        }
        const recruiterInfo = {
            name: Recruiter.name,
            id: Recruiter._id,
            email: Recruiter.email,
            companyName: Recruiter.companyName,
            phoneNumber: Recruiter.phoneNumber,
            role: Recruiter.role,
        }
        return res.status(201).json({
            Message: "Profile Created Successfully",
            Status: "Success",
            recruiterInfo
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}


const SignIn = async (req, res, next) => {
    const { recruiterEmail, password } = req.body
    if (!recruiterEmail || !password) {
        return res.status(400).json({
            Message: "Email and Password are required",
            Status: "Error"
        })
    }
    try {
        const recruiter = await RecruiterModel.findOne({ email: recruiterEmail }).select("+password")
        if (!recruiter) {
            return res.status(401).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }

        const isMatch = await bcrypt.compare(password, recruiter.password)
        if (!isMatch) {
            return res.status(401).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }

        const recruiterInfo = {
            name: recruiter.name,
            id: recruiter._id,
            email: recruiter.email,
            companyName: recruiter.companyName,
            phoneNumber: recruiter.phoneNumber,
            role: recruiter.role,
        }

        const generateToken = jwt.sign(
            { recruiterId: recruiter._id, recruiterEmail: recruiter.email },
            process.env.recruiterJwtToken,
            { expiresIn: process.env.jwtExpiryTime }
        )

        return res.status(200).json({
            Message: "Sign In Successful",
            Status: "Success",
            user: recruiterInfo,
            accessToken: generateToken
        })

    } catch (error) {
        console.log(error);
        next(error)
    }
}


const verifyCompanyToken = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                Message: "Token Not Found",
                Status: "Error"
            })
        }

        const { recruiterId } = jwt.verify(token, process.env.recruiterJwtToken)
        const user = await RecruiterModel.findById(recruiterId)
        if (!user) {
            return res.status(401).json({
                Message: "Recruiter Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Token is valid",
            Status: "Success",
            user
        })

    }
    catch (error) {
        console.log(error);
        next(error)
    }
}


const getRecruiter = async (req, res, next) => {
    const { recruiterId } = req.params
    try {
        const recruiter = await RecruiterModel.findById(recruiterId)

        if (!recruiter) {
            return res.status(404).json({
                Message: "Unable to Fetch Recruiter Details",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Recruiter Details Fetched Successfully",
            Status: "Success",
            recruiter
        })

    } catch (error) {
        console.log(error);
        next(error)
    }
}


const allRecruiter = async (req, res, next) => {
    try {
        const recruiters = await RecruiterModel.find()
        if (!recruiters) {
            return res.status(404).json({
                Message: "Unable to Fetch Recruiter Details",
                Status: "Error"
            })
        }
        return res.status(200).json({
            Message: "Recruiters Information Fetched",
            Status: "Success",
            No_Of_Recruiters: recruiters.length,
            recruiters
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}


module.exports = {
    SignUp,
    SignIn,
    verifyCompanyToken,
    getRecruiter,
    allRecruiter
}
