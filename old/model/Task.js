const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'in-review', 'done'],
        default: 'to-do'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent', 'optional'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);