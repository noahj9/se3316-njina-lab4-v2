//requirements for server
const express = require("express");
const stringSimilarity = require("string-similarity-js");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

//import all the schemas for db operations
//const User = require('./schemas/userSchema.js');
//const Review = require('./schemas/reviewSchema.js');
const Superpower = require('./schemas/superpowerSchema.js');
const Superhero = require('./schemas/superheroSchema.js');
//const SupherheroLists = require('./schemas/supherheroListSchema.js');
const PrivacyPolicies = require('./schemas/privacyPoliciesSchema.js');
//const Logs = require('./schemas/dmcaLogSchema.js');

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

// ############ HELPER FUNCTIONS and APIS
function sanitize(string) { //santizie user input by elminating characters that can be used for attacks, same from lab3
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

// ############ APIS #######################################

//AI PROMPT: write me a backend api (im using node.js) that will allow me to search by name, race, power, publisher and use string-similarity-js to softmatch search terms. the inputs should be sanitized by calling the sanitizeInput function and i should be able to enter a value for each search term and get a list of the corresponding superheroes.

//api for searching for superheroes
app.get('/api/search', async (req, res) => {
  const { name, race, power, publisher } = req.query;
  const similarityScore = 0.60;

  try {
    let superheroes = await Superhero.find();

    const filterBySimilarity = (field, value) => {
      if (sanitize(value)) {
        superheroes = superheroes.filter(hero =>
          (stringSimilarity.stringSimilarity(hero[field].toLowerCase(), value.toLowerCase()) > similarityScore) ||
          hero[field].toLowerCase().startsWith(value.toLowerCase())
        );
      }
    };

    filterBySimilarity('name', name);
    filterBySimilarity('Race', race);
    filterBySimilarity('Publisher', publisher);

    if (sanitize(power)) {
      const superpowers = await Superpower.find();
      const powerSearch = [];

      for (const sp of superpowers) {
        const powerNames = Object.keys(sp.toObject()).filter(p => p !== '_id' && p !== 'hero_names' && sp[p] === "True");
        for (const powerName of powerNames) {
          if (stringSimilarity.stringSimilarity(powerName.toLowerCase(), power.toLowerCase()) > similarityScore) {
            powerSearch.push(sp.hero_names);
            break;
          }
        }
      }

      superheroes = superheroes.filter(hero => powerSearch.includes(hero.name));
    }

    if (superheroes.length > 0) {
      return res.status(200).json(superheroes);
    } else {
      return res.status(404).json({ message: 'No matches found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});

//get the specified privacy policy so we can display it
//AI PROMPT: using my policies schema, write be a backend api that will accept the name of the policy in the query string and will lookup and return the policy from the database.
app.get('/api/policies', async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required in the query string.' });
    }

    const policy = await PrivacyPolicies.findOne({ name });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found.' });
    }

    return res.status(200).json(policy);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});


