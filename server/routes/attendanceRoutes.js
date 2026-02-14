const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// GET attendance for an employee
// We can also support GET all attendance if needed for debugging or overview
router.get('/:employeeId', async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.params.employeeId }).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST mark attendance
router.post('/', async (req, res) => {
    try {
        const { employeeId, date, status } = req.body;

        // Verify employee exists (using custom employeeId)
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Normalize date to midnight to avoid time discrepancies
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if already marked
        const existingRecord = await Attendance.findOne({
            employeeId,
            date: attendanceDate
        });

        if (existingRecord) {
            // Update existing or return error? 
            // Requirement says "Mark attendance". Updating seems user-friendly.
            existingRecord.status = status;
            const updatedRecord = await existingRecord.save();
            return res.json(updatedRecord);
        }

        const newRecord = new Attendance({
            employeeId,
            date: attendanceDate,
            status
        });

        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
