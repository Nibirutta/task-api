const Task = require('../model/Task');

const getAllTasks = async (req, res) => {
    const userInfo = req.user; // Assuming user info is attached to req by verifyJWT middleware

    if (!userInfo) {
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const tasks = await Task.find({ owner: userInfo._id }).sort({ createdAt: -1 }).exec();

        return res.status(200).json(tasks); // Return tasks in JSON format
    } catch (error) {
        return res.sendStatus(500); // Internal Server Error
    }
};

const createTask = async (req, res) => {
    const userInfo = req.user; // Assuming user info is attached to req by verifyJWT middleware

    if (!userInfo) {
        return res.sendStatus(401); // Unauthorized
    }

    const { title, description, status, dueDate } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed'];

    if (!title || !status) {
        return res.status(400).json({ message: 'Title and status are required.' });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const newTask = new Task({
            title,
            description,
            status,
            dueDate,
            owner: userInfo._id
        });

        const savedTask = await newTask.save();
        return res.status(201).json(savedTask); // Return the created task
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        return res.sendStatus(500); // Internal Server Error
    }
};

const updateTask = async (req, res) => {
    const userInfo = req.user; // Assuming user info is attached to req by verifyJWT middleware

    if (!userInfo) {
        return res.sendStatus(401); // Unauthorized
    }

    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed'];

    if ((!validStatuses.includes(status) && status !== undefined)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status, dueDate },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json(updatedTask); // Return the updated task
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        return res.sendStatus(500); // Internal Server Error
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask
};