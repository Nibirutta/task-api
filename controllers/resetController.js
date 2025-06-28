const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');

const requestReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            code: 'MISSING_EMAIL',
            message: 'Email is required.'
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            code: 'INVALID_EMAIL',
            message: 'Invalid email format.'
        });
    }

    try {
        const foundUser = await User.findOne({ email: email.toLowerCase() }).exec();

        if (!foundUser) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'No user found with this email.'
            });
        }

        await RefreshToken.deleteMany({ userId: foundUser._id }).exec(); // Clear any existing tokens

        const resetToken = jwt.sign(
            { "username": foundUser.username },
            process.env.RESET_TOKEN_SECRET,
            { expiresIn: '30m' } // Token valid for 30 minutes
        );

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.DEV_EMAIL, // Your email address
                pass: process.env.DEV_PASSWORD // Your email password or app password
            }
        });

        await transporter.sendMail({
            from: `"Task Manager" <${process.env.DEV_EMAIL}>`, // sender address
            to: foundUser.email, // list of receivers
            subject: 'Password Reset Request', // Subject line
            html: `Please click the link below to reset your password:<br>
                   <a href="${process.env.FRONTEND_URL}=${resetToken}">Reset Password</a><br>
                   This link will expire in 30 minutes.`,
            text: `Please click the link below to reset your password:\n
                   ${process.env.FRONTEND_URL}=${resetToken}\n`
        });

        foundUser.resetToken = resetToken; // Store the reset token in the user document

        await foundUser.save();

        return res.status(200).json({
            code: 'RESET_TOKEN_SENT',
            message: 'Password reset link has been sent to your email.'
        });
    } catch (err) {
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while processing your request.'
        });
    }
}

module.exports = {
    requestReset
};