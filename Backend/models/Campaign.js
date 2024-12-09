const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  start_date: Date,
  end_date: Date,
  status: String,
  videoLink: String // Add this field
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;
