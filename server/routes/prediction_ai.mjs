import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const router = express.Router();

router.post("/getPrediction", async (req, res) => {
  const { focus, breakTime, sessions } = req.body;

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          model: "google/gemini-2.5-flash-image-preview:free",
          messages: [
          {
            role: "user",
            content: `Based on my current stats:
            Focus: ${focus} minutes,
            Break Time: ${breakTime} minutes,
            Sessions: ${sessions}.
            
            Please predict my productivity trend for the coming week 📈 with numbers. Keep it short and  in 2-3 sentences.`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Prediction API response:", data);

    if (!data.choices || !data.choices.length) {
      throw new Error("No Prediction generated");
    }
    let raw = data.choices[0].message?.content || "No output";

    // If the model returns analysis + assistantfinal, clean it up
    let cleaned = raw;
    if (raw.includes("assistantfinal")) {
    cleaned = raw.split("assistantfinal").pop().trim();
    }

    res.json({ prediction: cleaned });
  } catch (err) {
    res.status(500).json({ prediction: "Could not fetch prediction at the moment." });
  }
});

export default router;