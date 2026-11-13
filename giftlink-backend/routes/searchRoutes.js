const express = require('express');
const connectToDatabase = require('../models/db');

const router = express.Router();

// GET /api/secondchance/search?name=&category=&condition=&age_years=
// (also mounted on /api/search for the gifts collection)
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();

        // Pick the collection depending on where the router is mounted
        const collectionName = req.baseUrl.indexOf('secondchance') !== -1 ? 'secondChanceItems' : 'gifts';
        const collection = db.collection(collectionName);

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

        const items = await collection.find(query).toArray();
        res.json(items);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
