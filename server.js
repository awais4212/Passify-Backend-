import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb'; // ✅ added ObjectId
import cors from 'cors';

dotenv.config(); // ✅ must be called before using process.env

// ✅ Using Atlas URL from .env instead of localhost
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = 'PassifyDB';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // ✅ bodyParser is deprecated, use express.json()

// Get all passwords
app.get('/', async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Passwords');
    const findResult = await collection.find({}).toArray();
    res.send(findResult);
})

// Save password
app.post('/', async (req, res) => {
    await client.connect(); // ✅ was missing connect()
    const db = client.db(dbName);
    const collection = db.collection('Passwords');
    const insertResult = await collection.insertOne(req.body);
    res.send({ success: true, result: insertResult });
})

// Delete password
app.delete('/', async (req, res) => {
    await client.connect(); // ✅ was missing connect()
    const db = client.db(dbName);
    const collection = db.collection('Passwords');
    const deleteResult = await collection.deleteOne({
        _id: new ObjectId(req.body.id) // ✅ properly targeting by MongoDB _id
    });
    res.send({ success: true, result: deleteResult });
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})