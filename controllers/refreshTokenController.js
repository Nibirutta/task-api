const jwt = require('jsonwebtoken');

const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');

const refreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }

    const oldRefreshToken = cookies.jwt;
    const foundToken = await RefreshToken.findOneAndDelete({ token: oldRefreshToken }).exec();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    // If no token is found, it might be a sign of a hacked user or an invalid token
    // We should verify the old refresh token to ensure it's valid and then delete all tokens for that user
    if (!foundToken) {
        jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden
                
                const hackedUser = await User.findOne({ username: decoded.username }).exec();

                if (!hackedUser) return res.sendStatus(403); // Forbidden

                await RefreshToken.deleteMany({ userId: hackedUser._id }).exec();
            }
        );

        return res.sendStatus(403); // Forbidden
    }

    const foundUser = await User.findOne({ _id: foundToken.userId }).exec();

    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(
        foundToken.token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403); // Forbidden
            }

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

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            );

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to 3 days

            const newRefreshTokenEntry = new RefreshToken({
                            userId: foundUser._id,
                            token: newRefreshToken,
                            createdAt: new Date(),
                            expiresAt: expirationDate
            });
            
            await newRefreshTokenEntry.save();

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true, // Not accessible to JavaScript
                sameSite: 'None', // for cross-site requests
                secure: true, // set to true if using HTTPS
                maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
            });

            res.json({ accessToken });
        }
    )
}

module.exports = { refreshToken };