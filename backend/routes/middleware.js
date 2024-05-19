const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")

const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message: "header is incorrect"
        }); 
    }
    try{
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded.userId){
            req.userId = decoded.userId;
            next();
        }else{
            return res.status(403).json({});
        }}
        catch(err){
            return res.status(403).json({
            message: "Error while verifying",
            error: err.message
        });
    }
}

module.exports = {
    authMiddleware
}