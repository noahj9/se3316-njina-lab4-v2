const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  superheroList: {
    // Assuming SuperheroList is another schema, you can reference it here
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperheroList'
  }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Function to compare entered password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

//AI PROMPT
// create me a schema to store users: userSchema. it needs to contain email, password, nickname, boolean isDisabled, boolen isAdmin, boolean isVerified, a verificationToken (string), and the SuperheroList objects that the user has created. 
//when a user is saved i want to has the password using bcrypt. i also need a function to compare an entered password with the hashed password to validate login credentials.
