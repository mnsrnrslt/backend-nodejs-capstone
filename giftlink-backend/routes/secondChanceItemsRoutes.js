const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();

// Folder where uploaded item images are stored
const directoryPath = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(directoryPath, { recursive: true });

// Multer storage: save the file into public/images with its original name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directoryPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// GET /api/secondchance/items - all items
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        logger.error('oops something went wrong', e);
        next(e);
    }
});

// POST /api/secondchance/items - add a new item with an image upload
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');

        const secondChanceItem = req.body;

        // ids are strings ("1".."16"), so find the max numerically
        const items = await collection.find({}, { projection: { id: 1 } }).toArray();
        const maxId = items.reduce((max, item) => Math.max(max, parseInt(item.id, 10) || 0), 0);
        secondChanceItem.id = (maxId + 1).toString();

        // date_added is stored in seconds
        secondChanceItem.date_added = Math.floor(Date.now() / 1000);

        if (req.file) {
            secondChanceItem.image = '/images/' + req.file.originalname;
        }

        await collection.insertOne(secondChanceItem);
        res.status(201).json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

// GET /api/secondchance/items/:id - one item
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const secondChanceItem = await collection.findOne({ id: req.params.id });

        if (!secondChanceItem) {
            return res.status(404).send('secondChanceItem not found');
        }

        res.json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

// PUT /api/secondchance/items/:id - update an item
router.put('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const id = req.params.id;

        const secondChanceItem = await collection.findOne({ id: id });
        if (!secondChanceItem) {
            logger.error('secondChanceItem not found');
            return res.status(404).json({ error: 'secondChanceItem not found' });
        }

        const update = {
            updatedAt: new Date()
        };
        if (req.body.category) {
            update.category = req.body.category;
        }
        if (req.body.condition) {
            update.condition = req.body.condition;
        }
        if (req.body.description) {
            update.description = req.body.description;
        }
        if (req.body.age_days !== undefined) {
            update.age_days = Number(req.body.age_days);
            update.age_years = Number((update.age_days / 365).toFixed(1));
        }

        const updated = await collection.findOneAndUpdate(
            { id: id },
            { $set: update },
            { returnDocument: 'after' }
        );

        if (updated) {
            res.json({ uploaded: 'success' });
        } else {
            res.json({ uploaded: 'failed' });
        }
    } catch (e) {
        next(e);
    }
});

// DELETE /api/secondchance/items/:id - remove an item
router.delete('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const id = req.params.id;

        const secondChanceItem = await collection.findOne({ id: id });
        if (!secondChanceItem) {
            logger.error('secondChanceItem not found');
            return res.status(404).json({ error: 'secondChanceItem not found' });
        }

        await collection.deleteOne({ id: id });
        res.json({ deleted: 'success' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
