const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
