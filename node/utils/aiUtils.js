const extractAndParseJsonObject = (rawText) => {
  const raw = String(rawText || "").trim();
  if (!raw) return { ok: false, error: "Empty model response" };

  // Remove common code fences
  const unfenced = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1) {
    return { ok: false, error: "No JSON object found", rawPreview: unfenced.slice(0, 1200) };
  }
  if (end === -1 || end <= start) {
    return { ok: false, error: "Incomplete JSON object (missing closing brace)", rawPreview: unfenced.slice(0, 1200) };
  }

  let candidate = unfenced.slice(start, end + 1);
  candidate = candidate
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  // First parse attempt
  try {
    return { ok: true, value: JSON.parse(candidate) };
  } catch {
    // Try a small set of safe repairs (no new deps)
    const repaired = candidate
      // remove trailing commas before } or ]
      .replace(/,\s*([}\]])/g, "$1")
      // normalize smart quotes
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

    try {
      return { ok: true, value: JSON.parse(repaired) };
    } catch (e2) {
      return {
        ok: false,
        error: "Failed to parse JSON",
        jsonPreview: candidate.slice(0, 1200),
        details: e2?.message || String(e2),
      };
    }
  }
};

const getGeminiFinishInfo = (response) => {
  const candidate = response?.candidates?.[0];
  return {
    finishReason: candidate?.finishReason,
    safetyRatings: candidate?.safetyRatings,
    promptFeedback: response?.promptFeedback,
    usageMetadata: response?.usageMetadata,
  };
};

async function generateJsonWithSingleRetry({ model, prompt, retryHint }) {
  const runOnce = async (extraHint = "") => {
    const result = await model.generateContent(extraHint ? `${extraHint}\n\n${prompt}` : prompt);
    const raw = result?.response?.text?.() ?? "";
    return { result, raw, parsed: extractAndParseJsonObject(raw) };
  };

  const first = await runOnce();
  if (first.parsed.ok) return first;

  const shouldRetry =
    first.parsed.error === "Incomplete JSON object (missing closing brace)" ||
    first.parsed.error === "Failed to parse JSON";

  if (!shouldRetry) return first;

  const second = await runOnce(
    retryHint ||
      "IMPORTANT: Your previous response was cut off / invalid. Return ONLY a COMPLETE, VALID JSON object. No markdown. Keep it concise."
  );
  return second.parsed.ok ? second : first;
}

module.exports = {
  extractAndParseJsonObject,
  getGeminiFinishInfo,
  generateJsonWithSingleRetry
};
