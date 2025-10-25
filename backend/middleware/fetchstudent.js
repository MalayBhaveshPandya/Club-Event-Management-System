const jwt = require("jsonwebtoken");

function fetchStudent(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT data:", data);
        if (!data.student || !data.student._id) {
            return res.status(401).send({ error: "Invalid token payload" });
        }
        req.student = data.student;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = { fetchStudent };
