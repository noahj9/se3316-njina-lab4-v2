const mongoose = require('mongoose');

const dmcaLogSchema = new mongoose.Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  receivedDate: {
    type: Date,
    default: null
  },
  noticeSentDate: {
    type: Date,
    default: null
  },
  disputeReceivedDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'processed'],
    default: 'active'
  }
});

const DMCALog = mongoose.model('DMCALog', dmcaLogSchema);

module.exports = DMCALog;


//AI PROMPT
// Make me a schema for mongodb for a dmca log, it will be associated with a Review (another schema), and needs to store the date the request was received, the date a notice was sent, a date when a dispute was received, notes about the log, and a status that should be active by default or processed