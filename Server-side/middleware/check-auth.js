const HttpError = require("../models/http-error")
const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{


    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          throw new Error("Authentication failed.");
        }
        const decodedToken = jwt.verify(token, "keytothechamberofsecrets")
        req.userData = {userId:decodedToken.userId}
        next()



    } catch (error) {
        const err = new HttpError("Authentication failed.");
        return next(err);
    }

    
}