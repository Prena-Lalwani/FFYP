const express = require("express");
const Campaign = require("../models/Campaign"); // Import Campaign model

// Create a router
const router = express.Router();

// POST route to create a campaign
router.post("/campaigns", async (req, res) => {
  try {
    const { name, description, date, timeSlot, videoType, videoData } = req.body;

    // Create a new campaign
    const campaign = new Campaign({
      name,
      description,
      date,
      timeSlot,
      videoType,
      videoData,
    });

    // Save the campaign to the database
    await campaign.save();
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/campaigns", async (req, res) => {
    try {
      // Retrieve all campaigns from the database
      const campaigns = await Campaign.find();
      res.status(200).json(campaigns); // Respond with campaign data
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  });

// Export the router
module.exports = router;
