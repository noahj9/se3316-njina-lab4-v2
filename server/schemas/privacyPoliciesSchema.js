const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  }
});

const PrivacyPolicy = mongoose.model('policies', privacyPolicySchema);

module.exports = PrivacyPolicy;

//AI PROMPT
//create me another schema to store privacyPolicies, it should store the name which is required and unique, and the content which is also required