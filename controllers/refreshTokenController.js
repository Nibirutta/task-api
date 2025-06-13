const jwt = require('jsonwebtoken');

const User = require('../model/User');

const refreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }

    const refreshToken = cookies.jwt;

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    // If no user found with the refresh token, possible token reuse attempt
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden
                
                const hackedUser = await User.findOne({ username: decoded.username }).exec();

                if (!hackedUser) return res.sendStatus(403); // Forbidden

                hackedUser.refreshToken = [];
                await hackedUser.save();
            }
        );

        return res.sendStatus(403); // Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            // If the token is invalid, we delete it from the user's refresh token array
            if (err) {
                foundUser.refreshToken = newRefreshTokenArray;
                await foundUser.save();
            }

            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403); // Forbidden
            }

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

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true, // Not accessible to JavaScript
                sameSite: 'None', // for cross-site requests
                secure: true // set to true if using HTTPS
            });

            res.json({ accessToken });
        }
    )
}

module.exports = { refreshToken };