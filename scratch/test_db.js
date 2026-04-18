const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing connection to:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB Atlas.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        console.error('Full Error:', JSON.stringify(err, null, 2));
        process.exit(1);
    }
};

testConnection();
