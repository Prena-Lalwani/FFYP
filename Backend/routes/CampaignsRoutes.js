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

router.get('/campaigns', async (req, res) => {
  console.log('Campaigns route initialized');
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// router.put("/api/campaigns/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedCampaign = await Campaign.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true } // Return the updated document
//     );

//     if (!updatedCampaign) {
//       return res.status(404).json({ error: "Campaign not found" });
//     }

//     res.json({ message: "Campaign status updated", updatedCampaign });
//   } catch (error) {
//     console.error("Error updating campaign:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.put("/api/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "ID and status are required." });
    }

    // Update campaign in the database
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.json({ message: "Campaign status updated successfully.", updatedCampaign });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Export the router
module.exports = router;
