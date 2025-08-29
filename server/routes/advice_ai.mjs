import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const router = express.Router();

router.post("/getAdvice", async (req, res) => {
  const { focus, breakTime, avgFocus, sessions } = req.body;

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
          model: "openai/gpt-oss-20b:free",
          messages: [
          {
            role: "user",
            content: `Here are my stats:
            Focus: ${focus} minutes,
            Break Time: ${breakTime} minutes,
            Avg Focus: ${avgFocus} minutes,
            Sessions: ${sessions}.
            
            Please give me only 2-3 short sentences on improving productivity.`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Prediction API response:", data);

    if (!data.choices || !data.choices.length) {
      throw new Error("No advice generated");
    }
        let raw = data.choices[0].message?.content || "No output";

    // If the model returns analysis + assistantfinal, clean it up
    let cleaned = raw;
    if (raw.includes("assistantfinal")) {
    cleaned = raw.split("assistantfinal").pop().trim();
    }

    res.json({ advice: cleaned });

    //res.json({ advice: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ advice: "Could not fetch advice at the moment." });
  }
});

export default router;