const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { connectDB } = require('./config/db')
const authRoutes = require('./routes/auth')
const passwordRoutes = require('./routes/passwords')

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/api/auth', authRoutes)
app.use('/', passwordRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Start server after DB connects
connectDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Backend running on http://localhost:${port}`)
    })
})