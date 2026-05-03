const dotenv = require("dotenv")
dotenv.config()
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../Model/EmployeeModel");
const isLoggedIn = async (req, res, next) => {

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


        const { userId } = await jwt.verify(token, process.env.jwtToken)
        const user = await EmployeeModel.findById(userId)
        if (!user) {
            return res.status(401).json({
                Message: "Employee Not Found",
                Status: "Error"
            })
        }

        req.user = user
        next()



    } catch (error) {
        console.log(error);
        next(error)

    }
}


module.exports = isLoggedIn              