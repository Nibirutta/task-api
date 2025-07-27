const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');
const emailTemplate = require('../template/emailTemplate');

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

    let html = emailTemplate
        .replace(/{{USER}}/g, foundUser.username)
        .replace(/{{RESET_TOKEN}}/g, resetToken);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.DEV_EMAIL, // Your email address
            pass: process.env.DEV_PASSWORD // Your email password or app password
        }
    });

    try {
        await transporter.sendMail({
            from: `"Task Manager" <${process.env.DEV_EMAIL}>`, // sender address
            to: foundUser.email, // list of receivers
            subject: 'Password Reset Request', // Subject line
            html: html, // html body
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

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { resetToken } = req.params;

    if (!newPassword || !resetToken) {
        return res.status(400).json({
            code: 'MISSING_FIELDS',
            message: 'New password and reset token are required.'
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            code: 'INVALID_PASSWORD_LENGTH',
            message: 'Password must be at least 8 characters long.'
        });
    }

    jwt.verify(
        resetToken,
        process.env.RESET_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired reset token.'
                });
            }

            const foundUser = await User.findOne({ username: decoded.username }).exec();

            if (!foundUser) {
                return res.status(404).json({
                    code: 'USER_NOT_FOUND',
                    message: 'No user found with this username.'
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            foundUser.password = hashedPassword;
            foundUser.resetToken = null;

            await foundUser.save();

            return res.status(200).json({
                code: 'PASSWORD_RESET_SUCCESS',
                message: 'Your password has been successfully reset.'
            });
        }
    )
}

module.exports = {
    requestReset,
    resetPassword
};