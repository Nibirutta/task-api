require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/dbConnection');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middlewares/verifyJWT');
const blockIfAuthenticated = require('./middlewares/blockIfAuthenticated');

const app = express();

const PORT = process.env.PORT || 3500;

connectDB();

// Middleware to handle CORS
app.use(cors(corsOptions));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

app.use('/user/register', blockIfAuthenticated, require('./routes/api/register')); // Register route
app.use('/user/login', blockIfAuthenticated, require('./routes/api/auth')); // Login route
app.use('/user/refresh', require('./routes/api/refreshToken')); // Refresh token route
app.use('/user/logout', require('./routes/api/logout')); // Logout route
app.use('/user/reset', blockIfAuthenticated, require('./routes/api/reset')); // Password reset route

app.use('/tasks', verifyJWT, require('./routes/api/tasks')); // Tasks route

// Start the server after connecting to the database
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});