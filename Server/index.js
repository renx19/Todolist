require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'https://todoapp-fe.netlify.app'], credentials: true }));

// Use routes
app.use(routes);

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

// Keep-alive function
const https = require('https');

const keepAlive = () => {
    const url = `https://todolist-be-m2hf.onrender.com/health`;

    https.get(url, (res) => {
        console.log('Keep-alive ping successful', res.statusCode);
    }).on('error', (e) => {
        console.error('Keep-alive ping failed', e);
    });
};


// Set up keep-alive interval (every 5 minutes)
setInterval(keepAlive, 5 * 60 * 1000);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});