const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
    try {
        console.log("Fetching all employees");
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new employee
router.post('/', async (req, res) => {
    try {
        const { employeeId, name, email, department } = req.body;

        // Check if employeeId or email already exists
        const existingEmployee = await Employee.findOne({ $or: [{ employeeId }, { email }] });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }

        const newEmployee = new Employee({
            employeeId,
            name,
            email,
            department
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        // We expect the MongoDB _id here, or use custom employeeId?
        // Let's support deletion by MongoDB _id for simplicity as it's standard RES
        // But functional requirement says "Delete an employee". 
        // Usually easier to delete by ID from the list.
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
