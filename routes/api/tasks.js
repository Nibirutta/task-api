const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');

router.route('/')
    .get(tasksController.getTasks) // Get tasks
    .post(tasksController.createTask); // Create a new task

router.route('/:id')
    .put(tasksController.updateTask) // Update a task
    .delete(tasksController.deleteTask); // Delete a task

module.exports = router;