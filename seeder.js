const fs = require('fs'),
    mongoose = require('mongoose'),
    colors = require('colors'),
    dotenv = require('dotenv');

// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamps');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`), 'utf-8'
);

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data Imported ...'.green.inverse);
        process.exit();
    } catch (e) {
        console.error(e);
    }
};

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data Destroyed ...'.red.inverse);
        process.exit();
    } catch (e) {
        console.error(e);
    }
};

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData();
}
