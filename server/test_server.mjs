import express from "express";
import cors from "cors";

const app = express();
const PORT = 5050;

app.use(cors()); // allow all origins
app.use(express.json()); // parse JSON bodies

// Simple test route
app.post("/api/getAdvice", (req, res) => {
  console.log("Request body received:", req.body);
  res.json({ advice: "This is a test advice ✅" });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});