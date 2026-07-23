const express = require('express')
const { client } = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// GET all passwords for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection('passwords')
        const passwords = await collection.find({ userId: req.user.id }).toArray()
        res.json(passwords)
    } catch (error) {
        console.error('Get passwords error:', error)
        res.status(500).json({ message: 'Internal server error.' })
    }
})

// POST save a new password for the logged-in user
router.post('/', authenticateToken, async (req, res) => {
    try {
        const password = req.body
        password.userId = req.user.id
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection('passwords')
        const result = await collection.insertOne(password)
        res.json({ success: true, result })
    } catch (error) {
        console.error('Save password error:', error)
        res.status(500).json({ message: 'Internal server error.' })
    }
})

// DELETE a password by id for the logged-in user
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({ success: false, message: 'Password ID is required.' })
        }
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection('passwords')
        const result = await collection.deleteOne({ id, userId: req.user.id })
        res.json({ success: true, result })
    } catch (error) {
        console.error('Delete password error:', error)
        res.status(500).json({ message: 'Internal server error.' })
    }
})

module.exports = router
