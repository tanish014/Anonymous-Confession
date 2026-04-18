const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing connection to:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE:', err.message);
        process.exit(1);
    }
};

testConnection();
