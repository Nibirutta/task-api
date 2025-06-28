const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401); // Unauthorized
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = decoded.UserInfo; // Attach user info to request object
            next(); // Proceed to the next middleware or route handler
        }
    )
}

module.exports = verifyJWT;