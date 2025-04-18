import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    status:{
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attachments: [
        {
            type: String,
        }
    ],
    todoCheckList: [todoSchema],
    progress: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

export const Task = mongoose.model('Task', taskSchema);