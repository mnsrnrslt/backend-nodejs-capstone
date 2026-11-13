require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'giftdb';

// Cache the connection so every request reuses one client instead of opening a new one
let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    // Connect to MongoDB
    await client.connect();

    // Connect to the database giftdb and store it in dbInstance
    dbInstance = client.db(dbName);

    return dbInstance;
}

module.exports = connectToDatabase;
