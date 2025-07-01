const RefreshToken = require('../model/RefreshToken');

const logoutUser = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    const foundToken = await RefreshToken.findOneAndDelete({ token: refreshToken }).exec();

    if (!foundToken) {
        return res.sendStatus(204); // No content
    }

    return res.sendStatus(204); // No content
}

module.exports = { logoutUser };