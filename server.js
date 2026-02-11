import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

dotenv.config();

// MongoDB connection
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = 'PassifyDB';
const app = express();
const port = process.env.PORT || 3000; // ✅ FIXED: Use Railway's dynamic port

app.use(cors());
app.use(express.json());

// Get all passwords
app.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Passwords');
        const findResult = await collection.find({}).toArray();
        res.send(findResult);
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
})

// Save password
app.post('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Passwords');
        const insertResult = await collection.insertOne(req.body);
        res.send({ success: true, result: insertResult });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
})

// Delete password
app.delete('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Passwords');
        const deleteResult = await collection.deleteOne({
            _id: new ObjectId(req.body.id)
        });
        res.send({ success: true, result: deleteResult });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
})

// ✅ FIXED: Bind to 0.0.0.0 and use dynamic port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
})