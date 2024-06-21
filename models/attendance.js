const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'late', 'absent'],
        required: true,
        minlength: 3,
        maxlength: 7
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
