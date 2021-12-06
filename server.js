const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
