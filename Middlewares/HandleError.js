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

const handleJsonWebTokenError = () => {
    const errMessage = `Invalid Signature`;

    return {
        errMessage,
        statusCode: 401,
    };
};

const handleTokenExpiredError = () => {
    return {
        errMessage: "Token has expired, please sign in again",
        statusCode: 401,
    };
};

const handleValidationError = (err) => {
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    return {
        errMessage: messages.join(", ") || "Validation error",
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
    if (err.code === 11000) {
        const error = handleDuplicateError(err)
        return res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error"
        })
    }
    else if (err.name === "CastError") {
        const error = handleCastError(err);
        return res.status(error.statusCode).json({
            Message: error.message,
            Status: "Error",
        });
    }
    else if (err.name === "ValidationError") {
        const error = handleValidationError(err);
        return res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error",
        });
    }
    else if (err.name === "JsonWebTokenError") {
        const error = handleJsonWebTokenError(err)
        return res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error"
        })
    }
    else if (err.name === "TokenExpiredError") {
        const error = handleTokenExpiredError()
        return res.status(error.statusCode).json({
            Message: error.errMessage,
            Status: "Error"
        })
    }
    else {
        return res.status(500).json({
            Message: "Opps Something went wrong..😭",
            Status: "Error"
        })
    }
}

module.exports = { handleError }
