const mongoose = require('mongoose');
const Review = require('./reviewSchema.js');

const superheroListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    superheroes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Superhero',
        required: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    creatorNickname: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [Review.schema]
});

module.exports = mongoose.model('SuperheroList', superheroListSchema);

//AI PROMPT
// create me anotehr schema to store superHeroLists, it should have the name of the list, a description, a list of superheroes in the list, an isPublic booelan,
// a last modified date, nickname of the creator of the list, an average rating between 0 and 5, and all the reviews associated with the list.