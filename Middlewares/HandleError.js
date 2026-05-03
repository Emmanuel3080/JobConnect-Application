const handleDuplicateError = (err) => {
    if (!err.keyValue) {
        return {
            errMessage: "Duplicate field error",
            statusCode: 400,
        }
    }
    const errKey = Object.keys(err.keyValue)[0]
    const errValue = Object.values(err.keyValue)[0]

    const errMessage = `${errKey} of ${errValue} already Exists `

    return {
        errMessage,
        statusCode: 400
    }
}

const handleJsonWebTokenError = (err) => {
    const errMessage = `Inavaild Signature`;

    return {
        errMessage,
        statusCode: 400,
    };
};
const handleCastError = (err) => {
    const message = `${err.value} doesn't exist in field (${err.path})`;
    return {
        message,
        statusCode: 400,
    };
};
const handleError = (err, req, res, next) => {
    // return res.status(400).json
    // console.log(`Err from ${err}`);

    if (err.code === 11000) {
        const error = handleDuplicateError(err)
        res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error"
        })
    }
    else if (err.name == "CastError") {
        const error = handleCastError(err);
        res.status(error.statusCode).json({
            Message: error.message,
            Status: "error",
        });
    }
    else if (err.name == "JsonWebTokenError") {
        const error = handleJsonWebTokenError(err)
        return res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error"
        })
    }
    else {
        return res.status(500).json({
            Message: "Opps Something went wrong..😭",
        })
    }
}

module.exports = { handleError }