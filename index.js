const express = require('express'),
      dotenv = require('dotenv'),
      morgan = require('morgan'),
      connectDB = require('./config/db');

// Load env vars;
dotenv.config({path: './config/config.env'});

// Connect to database;
connectDB();

// Router files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount Router
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


// Handle unhandle promise rejections
process.on('unhandleRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});