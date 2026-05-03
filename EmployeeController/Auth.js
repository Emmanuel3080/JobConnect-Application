const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const EmployeeModel = require("../Model/EmployeeModel")
const dotenv = require("dotenv")
dotenv.config()

const SignUp = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            Status: "Error",
            Message: "All fields are required",
        });
    }
    const imageFile = req.file;
    if (!imageFile) {
        return res.status(401).json({
            Status: "error",
            Message: "No Image File Found",
        });
    }
    try {
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const employeeUser = await EmployeeModel.create({
            ...req.body, password: hashedPassword, profileImage: imageFile.path
        })
        if (!employeeUser) {
            return res.status(400).json({
                Message: "Failed to Create Employee Profile",
                Status: "Error"
            })
        }
        const employeeInfo = {
            name: employeeUser.name,
            id: employeeUser._id,
            email: employeeUser.email,
            profileImage: employeeUser.profileImage,
            phoneNumber: employeeUser.phoneNumber,
            Location: employeeUser.Location,
            Skills: employeeUser.Skills,
            role: employeeUser.role,

        }


        return res.status(201).json({
            Message: "Employee Profile Created Successfully",
            Status: "Success",
            Employee: employeeInfo
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const SignIn = async (req, res, next) => {
    const { password, userEmail } = req.body
    try {
        const user = await EmployeeModel.findOne({ email: userEmail }).select("+password")

        if (!user) {
            return res.status(401).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }
        const verifyPassword = await bycrypt.compare(password, user.password)
        // return res.status(201).json({
        //     user
        // })
        if (!verifyPassword) {
            return res.status(401).json({
                Message: "Email or Password Incorrect",
                Status: "Error"
            })
        }

        const employeeInfo = {
            name: user.name,
            email: user.email,
            id: user?._id,
            profileImage: user?.profileImage,
            phoneNumber: user?.phoneNumber,
            Location: user?.Location,
            Skills: user?.Skills,
            role: user?.role,

        }

        const generateToken = await jwt.sign({ userId: user._id, userEmail: user.email }, process.env.jwtToken, { expiresIn: process.env.jwtExpiryTime })
        return res.status(201).json({
            Message: "Successful Sign in",
            Status: "Success",
            user: employeeInfo,
            accessToken: generateToken
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const getEmployee = async (req, res, next) => {
    const { employeeId } = req.params
    if (!employeeId) {
        return res.status(401).json({
            Message: "Id Not Found",
            Status: "Error"
        })
    }
    try {
        const user = await EmployeeModel.findById(employeeId)
        if (!user) {
            return res.status(401).json({
                Message: "Employee Not Found",
                Status: "Error"
            })
        }
        return res.status(201).json({
            Message: "Employee Profile Fetched Successfully",
            Status: "Success",
            user
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}

const updateEmployee = async (req, res, next) => {
    const { employeeId } = req.params;
    if (!employeeId) {
        return res.status(400).json({
            Message: "Employee ID not provided",
            Status: "Error"
        });
    }

    if (req.file) {
        req.body.cvUrl = req.file.path;
    }

    try {
        const updatedEmployee = await EmployeeModel.findOneAndUpdate(
            { _id: employeeId },
            { ...req.body },
            { returnDocument: 'after' }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                Message: "Employee not found",
                Status: "Error"
            });
        }

        return res.status(200).json({
            Message: `${req.body.field || "Employee"} profile updated successfully`,
            Status: "Success",
            user: updatedEmployee
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};



const allEmployee = async (req, res, next) => {
    try {
        const employees = await EmployeeModel.find()

        if (!employees) {
            return res.status(401).json({
                Message: "Unable to Fetch All Employee",
                Status: "Error"
            })
        }
        return res.status(200).json({
            Message: "All Employee in the Database Fetched",
            Status: "Success",
            No_of_Employee: employees.length,
            employees
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const deleteEmployee = async (req, res, next) => {
    const { id } = req.params
    try {
        const employee = await EmployeeModel.findByIdAndDelete(id)
        if (!employee) {
            return res.status(400).json({
                Message: "Employee ID not provided",
                Status: "Error"
            });
        }

        return res.status(200).json({
            Message: "Employee Profile Deleted Successfully",
            Status: "Success"
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}


const verifyToken = async (req, res, next) => {
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

        return res.status(201).json({
            Message: "Token is validd",
            Status: "Success",
            user
        })

    }
    catch (error) {
        console.log(error);
        next(error)

    }
}


module.exports = {
    SignUp,
    SignIn,
    updateEmployee,
    getEmployee,
    allEmployee,
    deleteEmployee,
    verifyToken
}