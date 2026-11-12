require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const connectToDatabase = require('./models/db');

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3060;

app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('GiftLink backend is running');
});

// Global error handler: receives errors passed with next(e)
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

connectToDatabase()
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((e) => {
        logger.error('Failed to connect to DB: ' + e.message);
    });

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
