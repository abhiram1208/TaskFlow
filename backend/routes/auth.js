const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                msg: 'Please enter all fields'
            });
        }
        const existingUser =
            await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg: 'User already exists'
            });
        }
        const user = new User({
            name,
            email,
            password
        });
        await user.save();
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );
        res.status(201).json({
            msg: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(
            'Register Error:',
            err
        );
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user =
            await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );
        if (!isMatch) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(
            'Login Error:',
            err
        );
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});
module.exports = router;