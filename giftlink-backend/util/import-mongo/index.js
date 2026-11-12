const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'giftdb';
const collectionName = 'gifts';
const filename = path.join(__dirname, 'gifts.json');

async function loadData() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;
        const existing = await collection.countDocuments();

        if (existing === 0) {
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
            console.log(insertResult);
        } else {
            console.log(`Gifts already exist in DB: ${existing} documents. Skipping import.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

loadData();
