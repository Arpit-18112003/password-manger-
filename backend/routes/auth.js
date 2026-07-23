const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { client } = require('../config/db')

const router = express.Router()

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' })
    }

    try {
        const db = client.db(process.env.DB_NAME)
        const usersCollection = db.collection('users')

        const existingUser = await usersCollection.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await usersCollection.insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date()
        })

        res.status(201).json({ success: true, message: 'User registered successfully.' })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Internal server error.' })
    }
})

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' })
    }

    try {
        const db = client.db(process.env.DB_NAME)
        const usersCollection = db.collection('users')

        const user = await usersCollection.findOne({ username })
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }

        const token = jwt.sign(
            { id: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({ success: true, token, username: user.username })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Internal server error.' })
    }
})

module.exports = router
