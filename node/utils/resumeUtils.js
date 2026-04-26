const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

function normalizeExtractedText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractResumeTextFromUpload(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(file.buffer);
    return normalizeExtractedText(data.text);
  }

  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return normalizeExtractedText(value);
  }

  if (ext === ".txt") {
    return normalizeExtractedText(file.buffer.toString("utf8"));
  }

  throw new Error("Invalid file type. Only PDF, DOCX, and TXT are allowed.");
}

module.exports = {
  normalizeExtractedText,
  extractResumeTextFromUpload
};
