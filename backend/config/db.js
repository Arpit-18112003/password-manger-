const dns = require('dns')
dns.setDefaultResultOrder('ipv4first')

const { MongoClient } = require('mongodb')

const url = process.env.MONGO_URI
const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 })

const connectDB = async () => {
    try {
        await client.connect()
        console.log('✅ MongoDB Connected successfully!')
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message)
        process.exit(1)
    }
}

module.exports = { client, connectDB }
