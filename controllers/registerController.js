const bcrypt = require('bcrypt');

const User = require('../model/User');

const registerNewUser = async (req, res) => {
    const { firstname, lastname, username, password } = req.body;

    if (!firstname || !username || !password) {
        return res.status(400).json({ message: 'First name, username, and password are required.' });
    }

    const duplicate = await User.findOne({ username }).exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            username,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({ message: 'User registered successfully.' });
        } else {
            return res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });    
    }
}

module.exports = { registerNewUser };