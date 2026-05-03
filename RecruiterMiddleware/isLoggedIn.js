const RecruiterModel = require("../Model/JobPostermODEL");
const jwt = require("jsonwebtoken")

const IsRecruiterloggedIn = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                Message: "Token Not Found, Kindly Log In",
                Status: "Error"
            })
        }


        const { recruiterId } = await jwt.verify(token, process.env.recruiterJwtToken)
        const user = await RecruiterModel.findById(recruiterId)
        if (!user) {
            return res.status(401).json({
                Message: "Recruiter Not Found",
                Status: "Error"
            })
        }

        req.user = user
        next()

    }
    catch (error) {
        console.log(error);
        next(error)

    }

}


module.exports = IsRecruiterloggedIn