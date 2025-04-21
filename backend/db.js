const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        
        console.log('MongoDB connected successfully');
        console.log('Database name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        
        // Log any connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error after initial connection:', err);
        });
        
        // Log when connection is disconnected
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
        
        // Log when connection is reconnected
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        process.exit(1);
    }
};

module.exports = connectDB; 