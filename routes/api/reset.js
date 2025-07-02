const express = require('express');
const router = express.Router();
const resetController = require('../../controllers/resetController');

router.route('/request')
    .post(resetController.requestReset) // Request password reset

router.route('/:resetToken')
    .post(resetController.resetPassword) // Reset password using token

module.exports = router;