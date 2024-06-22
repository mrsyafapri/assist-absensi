const Attendance = require('../models/attendance');
const LeaveRequest = require('../models/leaveRequest');
const { responseSuccess, responseError } = require('../utils/responseHandler');

const markAttendance = async (req, res) => {
    const { date, status } = req.body;
    const employeeId = req.employee.id;

    try {
        const attendance = new Attendance({ employee: employeeId, date, status });
        await attendance.save();
        responseSuccess(res, attendance, 'Attendance marked successfully', 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            responseError(res, 'Invalid data', 400);
        } else {
            responseError(res, 'Internal server error', 500);
        }
    }
};

const requestLeave = async (req, res) => {
    const { startDate, endDate, reason } = req.body;
    const employeeId = req.employee.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
        return responseError(res, 'End date cannot be earlier than start date', 400);
    }

    try {
        const conflictingLeaveRequest = await LeaveRequest.findOne({
            employee: employeeId,
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ]
        });

        if (conflictingLeaveRequest) {
            return responseError(res, 'Leave request conflicts with an existing leave request', 409);
        }

        const leaveRequest = new LeaveRequest({ employee: employeeId, startDate: start, endDate: end, reason });
        await leaveRequest.save();
        responseSuccess(res, leaveRequest, 'Leave request submitted successfully', 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            responseError(res, 'Invalid data', 400);
        } else {
            responseError(res, 'Internal server error', 500);
        }
    }
};

const statusLeave = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const validStatuses = ['approved', 'rejected'];

    if (!validStatuses.includes(status)) {
        return responseError(res, 'Invalid status', 400);
    }

    try {
        const leaveRequest = await LeaveRequest.findById(id);
        if (!leaveRequest) {
            return responseError(res, 'Leave request not found', 404);
        }

        leaveRequest.status = status;
        await leaveRequest.save();
        responseSuccess(res, leaveRequest, `Leave ${status} successfully`, 200);
    } catch (err) {
        responseError(res, 'Internal server error', 500);
    }
};

const generateReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    const employeeId = req.employee.id;

    try {
        if (!startDate || !endDate) {
            return responseError(res, 'Start date and end date are required', 400);
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return responseError(res, 'Invalid date format', 400);
        }

        const [attendanceRecords, leaveRequests] = await Promise.all([
            Attendance.find({ employee: employeeId, date: { $gte: start, $lte: end } }).lean(),
            LeaveRequest.find({ employee: employeeId, startDate: { $gte: start }, endDate: { $lte: end } }).lean()
        ]);

        const attendanceSummary = attendanceRecords.reduce((acc, record) => {
            if (record.status === 'late') acc.late += 1;
            if (record.status === 'absent') acc.absent += 1;
            return acc;
        }, { late: 0, absent: 0 });

        const leaveSummary = leaveRequests.reduce((acc, request) => {
            if (request.status === 'approved') acc.approved += 1;
            if (['pending', 'rejected'].includes(request.status)) acc.rejected += 1;
            return acc;
        }, { approved: 0, rejected: 0 });

        const report = {
            attendance: attendanceSummary,
            leave: leaveSummary
        };
        responseSuccess(res, report, 'Report generated successfully', 200);
    } catch (err) {
        responseError(res, 'Internal server error', 500);
    }
};

module.exports = {
    markAttendance,
    requestLeave,
    statusLeave,
    generateReport
};
