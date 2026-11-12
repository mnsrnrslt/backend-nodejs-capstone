const express = require('express');
const connectToDatabase = require('../models/db');

const router = express.Router();

// GET /api/search?name=&category=&condition=&age_years=
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        // Build the query object only from filters that were actually sent
        const query = {};

        if (req.query.name && req.query.name !== '') {
            // "i" = case-insensitive matching
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years, 10) };
        }

        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
