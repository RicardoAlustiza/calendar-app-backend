const path = require('path');
const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Create express app
const app = express();

// Database connection
dbConnection();

// CORS
app.use(cors());

// Public directory
app.use(express.static('public'));

// Read and parse body
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Listen port 4001
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 4001');
});