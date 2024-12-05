const mongoose = require("mongoose");

// Define Campaign schema
const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  videoType: { type: String, required: true }, // e.g., "youtube"
  videoData: { type: String, required: true }, // URL or video path
});

module.exports = mongoose.model("Campaign", CampaignSchema);
