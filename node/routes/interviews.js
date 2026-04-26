const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Interview = require("../models/Interview");

// All routes require auth
router.use(auth);

// Create interview
router.post("/", async (req, res) => {
  try {
    const { position, description, experience, techStack, questions } =
      req.body;
    
    const interview = await Interview.create({
      userId: req.user.id,
      position,
      description,
      experience,
      techStack,
      questions: Array.isArray(questions) ? questions : [],
    });

    res.status(201).json({
      success: true,
      data: interview,
      message: "Interview created successfully",
    });
  } catch (error) {
    console.error("Create interview error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create interview",
      error: error.message,
    });
  }
});

// List current user's interviews
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: interviews,
      message: "Interviews fetched successfully",
    });
  } catch (error) {
    console.error("List interviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
});

// Get one by id
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }
    res.json({
      success: true,
      data: interview,
      message: "Interview fetched successfully",
    });
  } catch (error) {
    console.error("Get interview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
      error: error.message,
    });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { position, description, experience, techStack, questions } =
      req.body;
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { position, description, experience, techStack, questions },
      { new: true, runValidators: true }
    );
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }
    res.json({
      success: true,
      data: interview,
      message: "Interview updated successfully",
    });
  } catch (error) {
    console.error("Update interview error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update interview",
      error: error.message,
    });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }
    res.json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete interview error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete interview",
      error: error.message,
    });
  }
});

module.exports = router;
