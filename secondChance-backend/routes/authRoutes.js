require('dotenv').config();
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_secret_change_me';

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email || !password || !firstName) {
            return res.status(400).json({ error: 'firstName, email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Check if the email is already registered
        const existingEmail = await collection.findOne({ email: email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        // Never store plain passwords: hash with a salt
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = await collection.insertOne({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hash,
            createdAt: new Date()
        });

        const payload = {
            user: {
                id: newUser.insertedId.toString()
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Find the current user by email
        const theUser = await collection.findOne({ email: req.body.email });

        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordOk = await bcryptjs.compare(req.body.password || '', theUser.password);
        if (!passwordOk) {
            logger.error('Passwords do not match');
            return res.status(401).json({ error: 'Wrong password' });
        }

        const payload = {
            user: {
                id: theUser._id.toString()
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User logged in successfully');
        return res.status(200).json({
            authtoken,
            userName: theUser.firstName,
            userEmail: theUser.email
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// PUT /api/auth/update - change first name (email comes from the "email" header)
router.put('/update', [body('name').notEmpty().withMessage('Name is required')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await collection.findOneAndUpdate(
            { email: email },
            { $set: { firstName: req.body.name, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        const payload = {
            user: {
                id: updatedUser._id.toString()
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User updated successfully');
        res.json({ authtoken, userName: updatedUser.firstName });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

module.exports = router;
