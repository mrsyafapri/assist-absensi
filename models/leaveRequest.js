const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        minlength: 7,
        maxlength: 8
    }
}, {
    timestamps: true
});

// Create compound index for efficient queries
leaveRequestSchema.index({ employee: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
