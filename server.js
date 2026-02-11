import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import cors from 'cors';

dotenv.config();

const url = process.env.MONGO_URI;

// Add SSL/TLS options
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbName = 'PassifyDB';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*'  // allows all origins
}))
app.use(express.json());

let db, collection;

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        collection = db.collection('Passwords');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Get all passwords
app.get('/', async (req, res) => {
    try {
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        console.error('GET error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

// Save password
app.post('/', async (req, res) => {
    try {
        const insertResult = await collection.insertOne(req.body);
        res.json({ success: true, result: insertResult });
    } catch (error) {
        console.error('POST error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

// Delete password
app.delete('/', async (req, res) => {
    try {
        const deleteResult = await collection.deleteOne({
            _id: new ObjectId(req.body.id)
        });
        res.json({ success: true, result: deleteResult });
    } catch (error) {
        console.error('DELETE error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

connectDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
});