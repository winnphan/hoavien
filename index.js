const path = require('path'),
    express = require('express'),
      dotenv = require('dotenv'),
      morgan = require('morgan'),
      colors = require('colors'),
      fileupload = require('express-fileupload'),
      errorHandler = require('./middleware/error'),
      connectDB = require('./config/db');

// Load env vars;
dotenv.config({path: './config/config.env'});

// Connect to database;
connectDB();

// Router files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
);


// Handle unhandle promise rejections
process.on('unhandleRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
});
