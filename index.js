require('dotenv').config();
const port=process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


app.use(cors({origin:true}));

// Configuring the database
const dbConfig = require('./config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.use(express.json());


const userRouter=require('./routes/users');

app.use('/users',userRouter);

// listen for requests
app.listen(port || 3000, (req,res) => {
   
    console.log("Server is listening on port 3000");
});