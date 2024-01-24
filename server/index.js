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

// Middleware to verify the user's token
//AI Prompt: given in same AI prompt as the create lists API
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided.' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    req.user = decoded;
    next();
  });
};

const checkProperEmailFormat = (email) => {
  // Basic email format validation
  //test criteria from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).send({ message: 'Email not in correct format, try again!' });
}
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

// API endpoint to get public superhero lists sorted by lastModified, max 10 results
//AI PROMPT: based on my lists schema, create me a backend api to get all of the public lists and sort them in order of lastModified, i only want to return 10 max.
app.get('/api/public-lists', async (req, res) => {
  try {
    const publicLists = await SuperheroList.find({ isPublic: true })
      .sort({ lastModified: -1 }) // Sort in descending order of lastModified
      .limit(10); // Limit to 10 results

    return res.status(200).json(publicLists);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});

// API endpoint to create a new superhero list
//AI PROMPT: create me an api to create a new superhero list, i want to verify that the user is logged in before they can create a new list
//the nickname i will get from the users token, the verify token will be required instead of requireAuth. i also need to get the superheroes added to the list and make sure i am saving the ids to the superheros field in the new list
app.post('/api/create-list', verifyToken, async (req, res) => {
  const { name, description, superheroes, isPublic } = req.body;
  const creatorNickname = req.user.nickname; // Get the nickname from the user's token

  try {
    // Get superhero IDs from their names
    const listSuperheroIds = await Promise.all(superheroes.map(async (superhero) => {
      // Find the ID of the superhero from its name
      const heroId_temp = await Superhero.findOne({ name: superhero.name });
      return heroId_temp?._id; // Return the ID to be saved to the list
    }));

    // Create a new superhero list
    const newList = new SuperheroList({
      name,
      description,
      superheroes: listSuperheroIds,
      isPublic,
      creatorNickname
    });

    // Save the new list to the database
    await newList.save();

    return res.status(201).json({ message: 'Superhero list created successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});

// get a superhero from the db
//AI PROMPT: write me an api that accepts an id, looks to see if its a valid superhero, then returns the id of the superhero if its valid
app.get('/api/getSuperhero/:id', async (req, res) => {
  const superheroId = parseInt(req.params.id);

  try {
    const superhero = await Superhero.findOne({ id: superheroId });

    if (superhero) {
      return res.send(superhero);
    } else {
      return res.status(404).json({ message: 'Superhero not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});

// ##################### LOGIN AND REGISTER API's #############################

// API endpoint for user registration
//AI PROMPT: create me a backend api that can be used for users to register for an account,
//they need to provide email, password, nickname for their account
//we should check to see if the user already exists if not then we should add them to the database
app.post('/api/register', async (req, res) => {
  const { email, password, nickname } = req.body;

  checkProperEmailFormat(email);

  try {
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Create a new user
    const newUser = new User({
      email,
      password,
      nickname
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ message: 'User registration successful.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server Error Encountered', error: error.message });
  }
});
