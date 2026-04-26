const express = require("express");
const router = express.Router();
const multer = require("multer");
const aiController = require("../controllers/aiController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ATS evaluation
router.post("/ats-evaluate", upload.single("resume"), aiController.atsEvaluate);

// Skill gap analysis
router.post("/skill-gap-analysis", upload.single("resume"), aiController.skillGapAnalysis);

// AI Generation routes
router.post("/generate-summary", aiController.generateSummary);
router.post("/generate-experience", aiController.generateExperience);
router.post("/generate-project", aiController.generateProject);


module.exports = router;
