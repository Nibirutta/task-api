const Task = require('../model/Task');

const getTasks = async (req, res) => {
    const userInfo = req.user; // Assuming user info is attached to req by verifyJWT middleware

    if (!userInfo) {
        return res.sendStatus(401); // Unauthorized
    }

    const { title, status, priority } = req.query; // Get query parameters

    let filter = { owner: userInfo._id }; // Filter by user ID

    if (title) {
        filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search for title
    }

    if (status) {
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
        }
        filter.status = status; // Filter by status
    }

    if (priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ message: `Priority must be one of: ${validPriorities.join(', ')}` });
        }
        filter.priority = priority; // Filter by priority
    }

    try {
        const tasks = await Task.find(filter).sort({ createdAt: -1 }).exec();

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

    const { title, description, status, priority, dueDate } = req.body;
    
    if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required.' });
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];

    if (!validStatuses.includes(status) && status !== undefined) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const validPriorities = ['low', 'medium', 'high'];

    if (!validPriorities.includes(priority) && priority !== undefined) {
        return res.status(400).json({ message: `Priority must be one of: ${validPriorities.join(', ')}` });
    }

    try {
        const newTask = new Task({
            title,
            description,
            status,
            priority,
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
    const { title, description, status, priority, dueDate } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed'];

    if ((!validStatuses.includes(status) && status !== undefined)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const validPriorities = ['low', 'medium', 'high'];

    if ((!validPriorities.includes(priority) && priority !== undefined)) {
        return res.status(400).json({ message: `Priority must be one of: ${validPriorities.join(', ')}` });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            { _id: id, owner: userInfo._id }, // Ensure the task belongs to the user
            { title, description, status, priority, dueDate },
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

const deleteTask = async (req, res) => {
    const userInfo = req.user; // Assuming user info is attached to req by verifyJWT middleware

    if (!userInfo) {
        return res.sendStatus(401); // Unauthorized
    }

    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, owner: userInfo._id }).exec(); // Ensure the task belongs to the user

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json({ message: 'Task deleted successfully.' }); // Return success message
    } catch (error) {
        return res.sendStatus(500); // Internal Server Error
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};