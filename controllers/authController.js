const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

const loginUser = async (req, res) => {
    const cookie = req.cookies;
    const insertedUsername = req.body.username;
    const insertedPassword = req.body.password;

    if (!insertedUsername || !insertedPassword) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const foundUser = await User.findOne({ username: insertedUsername }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: 'Username or password are invalid' });
    }

    try {
        const match = await bcrypt.compare(insertedPassword, foundUser.password);

        if (match) {
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "firstname": foundUser.firstname,
                        "lastname": foundUser.lastname
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            );

            // Remove the old refresh token from the array if it exists
            // and add the new one
            const newRefreshTokenArray = !cookie?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookie.jwt);

            if (cookie?.jwt) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            }

            foundUser.refreshToken = [...newRefreshTokenArray, refreshToken];

            await foundUser.save();

            // Set the refresh token in an HTTP-only cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true, // Not accessible to JavaScript
                sameSite: 'None', // for cross-site requests
                secure: true, // set to true if using HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({ accessToken });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { loginUser };