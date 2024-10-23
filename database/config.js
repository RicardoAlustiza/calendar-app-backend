const mongoose = require('mongoose');

process.loadEnvFile();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('Database online');
    } catch (error) {
        console.log(error);
        throw new Error('Error initializing the database');
    }
};

module.exports = {
    dbConnection
}