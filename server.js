// console.log("Hellooo");

const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
app.use(cors())

const morgan = require("morgan")
const connectDb = require("./ConnectDatabase/ConnectDb")
const EmployeeRouter = require("./Router/EmployeeRouter")
const { handleError } = require("./Middlewares/HandleError")
const JobPosterRouter = require("./Router/JobPoster")
app.use(morgan("dev"))

const portnumber = process.env.PortNumber
// console.log(portnumber);

app.use(express.json())

app.listen(portnumber, () => {
    console.log(`Port Running at http://localhost:${portnumber}`);

})


connectDb()

app.use("/employee", EmployeeRouter)
app.use("/company", JobPosterRouter)


app.get("/", (req, res) => {
    res.send("Hello Emmanuel")
})


app.use("/{*any}", handleError);


app.all("/{*any}", (req, res) => {
    return res.status(500).json({
        Message: `${req.method} ${req.originalUrl} not a valid endpoint on this server`
    })
})


