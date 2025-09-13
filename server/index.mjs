import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import cors from "cors";
import express from "express";
import advice_ai from "./routes/advice_ai.mjs";
import prediction_ai from "./routes/prediction_ai.mjs";
import stats_db from "./routes/stats.mjs";
import session from "express-session";
import passport from "passport";
import authRoutes from "./auth.mjs";

const app = express();
const PORT = 5050;

// CORS and JSON parsing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax" },
  })
);

//  Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", advice_ai);
app.use("/api", prediction_ai);
app.use("/api", stats_db);
app.use("/auth", authRoutes);

// Logged-in user info
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({
      googleId: req.user.googleId,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});