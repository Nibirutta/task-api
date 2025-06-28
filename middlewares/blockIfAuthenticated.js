const blockIfAuthenticated = (req, res, next) => {
    const cookies = req.cookies;
    if (cookies?.jwt) {
        return res.status(403).json({
            code: 'ALREADY_AUTHENTICATED',
            message: 'You are already authenticated.'
        });
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = blockIfAuthenticated;