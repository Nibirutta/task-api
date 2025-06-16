const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');

router.route('/')
    .get(tasksController.getAllTasks) // Get all tasks
    .post(tasksController.createTask); // Create a new task

module.exports = router;