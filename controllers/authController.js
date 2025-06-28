const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');

const loginUser = async (req, res) => {
    const insertedUsername = req.body.username;
    const insertedPassword = req.body.password;

    if (!insertedUsername || !insertedPassword) {
        return res.status(400).json({
            code: 'MISSING_CREDENTIALS',
            message: 'Username and password are required.'
        });
    }

    const foundUser = await User.findOne({ username: insertedUsername }).exec();

    if (!foundUser) {
        return res.status(401).json({
            code: 'INVALID_CREDENTIALS',
            message: 'Username or password are invalid'
        });
    }

    try {
        const match = await bcrypt.compare(insertedPassword, foundUser.password);

        if (match) {
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "_id": foundUser._id,
                        "email": foundUser.email,
                        "username": foundUser.username,
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

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to 3 days

            const newRefreshTokenEntry = new RefreshToken({
                userId: foundUser._id,
                token: refreshToken,
                createdAt: new Date(),
                expiresAt: expirationDate
            });

            await newRefreshTokenEntry.save();

            // Set the refresh token in an HTTP-only cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true, // Not accessible to JavaScript
                sameSite: 'None', // for cross-site requests
                secure: true, // set to true if using HTTPS
                maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
            });

            res.status(200).json({ 
                message: 'Login successful',
                accessToken: accessToken
            });
        }
    } catch (err) {
        return res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { loginUser };