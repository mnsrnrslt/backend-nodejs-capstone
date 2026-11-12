const express = require('express');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();

// GET /api/gifts - list all gifts
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        logger.error('Error fetching gifts');
        next(e);
    }
});

// GET /api/gifts/:id - one gift by its id
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const id = req.params.id;
        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json(gift);
    } catch (e) {
        logger.error('Error fetching gift by id');
        next(e);
    }
});

// POST /api/gifts - add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne(req.body);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
