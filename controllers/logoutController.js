const User = require('../model/User');

const logoutUser = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }

    const refreshToken = cookies.jwt;

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) {
        return res.sendStatus(204); // No content
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    await foundUser.save();

    return res.sendStatus(204); // No content
}

module.exports = { logoutUser };