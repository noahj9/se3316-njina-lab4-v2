const mongoose = require('mongoose');

const superheroSchema = new mongoose.Schema({
    id: Number,
    name: String,
    Gender: String,
    'Eye color': String,
    Race: String,
    'Hair color': String,
    Height: Number,
    Publisher: String,
    'Skin color': String,
    Alignment: String,
    Weight: Number
});

module.exports = mongoose.model('Superhero', superheroSchema);

