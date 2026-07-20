const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

dotenv.config()

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

// App & Database
const dbName = process.env.DB_NAME 
const app = express()
const port = 3000 

// Middleware
app.use(bodyparser.json())
app.use(cors())

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. Token missing." });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.user = user;
        next();
    });
};

// --- AUTHENTICATION ROUTES ---

// Register User
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const result = await usersCollection.insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({ success: true, message: "User registered successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Find user
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, username: user.username });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// --- SECURED PASSWORD CRUD ROUTES ---

// Get all the passwords for the logged-in user
app.get('/', authenticateToken, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({ userId: req.user.id }).toArray();
    res.json(findResult)
})

// Save a password for the logged-in user
app.post('/', authenticateToken, async (req, res) => { 
    const password = req.body
    password.userId = req.user.id; // Associate password with user
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Delete a password by id for the logged-in user
app.delete('/', authenticateToken, async (req, res) => { 
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne({ ...password, userId: req.user.id });
    res.send({success: true, result: findResult})
})

app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})