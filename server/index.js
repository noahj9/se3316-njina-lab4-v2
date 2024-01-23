//requirements for server
const express = require("express");
const stringSimilarity = require("string-similarity-js");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

//import all the schemas for db operations
const User = require('./schemas/userSchema.js');
const Review = require('./schemas/reviewSchema.js');
const Superpower = require('./schemas/superPowerSchema.js');
const Superhero = require('./schemas/superheroSchema.js');
const SupherheroLists = require('./schemas/supherheroListSchema');
const Policies = require('./schemas/privacyPoliciesSchema.js');
const Logs = require('./schemas/dmcaLogSchema.js');

require("dotenv").config(); //environment variables import

// ############## MONGOOSE AND EXPRESS STUFF #########################################

//basic express app and mongoose connection
const app = express();
app.use(express.json());

//MONGOOSE CONNECTIONS (default code from mongo documentation)
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.xvbvunw.mongodb.net/?retryWrites=true&w=majority`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', () => {
    console.log('Connected to Mongo');
});

//static file serving, start the server
app.use('/', express.static('../client/build'));
app.listen(process.env.PORT,() => console.log("Server listening..."));