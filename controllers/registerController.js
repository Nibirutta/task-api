const bcrypt = require('bcrypt');
const validator = require('validator');

const User = require('../model/User');

const registerNewUser = async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    if (!firstname || !email || !username || !password) {
        return res.status(400).json({
            code: 'MISSING_FIELDS', 
            message: 'First name, email, username, and password are required.' 
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            code: 'INVALID_EMAIL',
            message: 'Invalid email format.' 
        });
    }

    const duplicate = await User.findOne({ 
        $or: [
            { email: email.toLowerCase() }, 
            { username: username }
        ] 
    }).exec();

    if (duplicate) {
        return res.status(409).json({
            code: 'DUPLICATE_USER',
            message: 'Email or username already exists.'
        });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
            code: 'INVALID_USERNAME_LENGTH',
            message: 'Username must be between 3 and 20 characters.'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            code: 'INVALID_PASSWORD_LENGTH',
            message: 'Password must be at least 8 characters long.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            username,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({
                code: 'USER_REGISTERED',
                message: 'User registered successfully.'
            });
        } else {
            return res.status(400).json({
                code: 'USER_REGISTRATION_FAILED',
                message: 'Invalid user data.'
            });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: err.message
            });
        }

        return res.sendStatus(500); // Internal Server Error
    }
}

module.exports = { registerNewUser };