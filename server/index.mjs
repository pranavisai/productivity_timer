import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import advice_ai from "./routes/advice_ai.mjs";
import prediction_ai from "./routes/prediction_ai.mjs";
import session from "express-session";
import passport from "passport";
import authRoutes from "./auth.mjs";


dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = 5050;

app.use(cors());

app.use(express.json());
app.use("/api", advice_ai);
app.use("/api", prediction_ai);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});