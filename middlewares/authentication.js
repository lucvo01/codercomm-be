const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const { AppError } = require("../helpers/utils")

const authentication = {}

authentication.loginRequired = (req, res, next) => {
    try {
        const tokenString = req.headers.authentication 
        console.log(tokenString)
    } catch (error) {
        next(error)
    }
}

module.exports = authentication