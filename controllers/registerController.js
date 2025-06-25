const bcrypt = require('bcrypt');

const User = require('../model/User');

const registerNewUser = async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    if (!firstname || !email || !username || !password) {
        return res.status(400).json({ message: 'First name, email, username, and password are required.' });
    }

    const duplicate = await User.findOne({ 
        $or: [
            { email: email.toLowerCase() }, 
            { username: username }
        ] 
    }).exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Email or username already exists.' });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: 'Username must be between 3 and 20 characters.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
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
            return res.status(201).json({ message: 'User registered successfully.' });
        } else {
            return res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });    
    }
}

module.exports = { registerNewUser };