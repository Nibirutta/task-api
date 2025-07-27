const allowedOrigins = require('./allowedOrigins');

// CORS (Cross-Origin Resource Sharing) is a security feature
// That allows or restricts resources from other origins (domains, protocols, or ports).
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // For legacy browser support
};

module.exports = corsOptions;