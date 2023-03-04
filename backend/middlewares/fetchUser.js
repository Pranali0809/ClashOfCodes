const jwt = require("jsonwebtoken")
const JWT_SECRET = "HelloRashid"

const fetchuser = (req, res, next) => {
    // Get the user from JWT token and append it to req object
    const token = req.header("auth-token");
    if(!token) return res.status(401).send({error : "Please Authentiacate with valid token"})
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error : "Please Authentiacate with valid token"})
    }
}

module.exports = fetchuser;