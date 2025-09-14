import express from "express";
import pool from "./db.mjs";
import { ensureAuth } from "../middlewares/authentication.mjs";

const router = express.Router();

// constants for dashboard
const CHAI_MIN = 15;
const MEDITATION_MIN = 5;

router.get("/stats/:userId", ensureAuth, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId) || userId !== Number(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const sess = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE ended_at IS NOT NULL) AS sessions_completed,
         COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at))),0) AS total_focus_seconds,
         COALESCE(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))),0) AS avg_focus_seconds
       FROM sessions
       WHERE user_id=$1`,
      [userId]
    );

    const br = await pool.query(
      `SELECT COALESCE(chai_count,0) AS chai, COALESCE(meditation_count,0) AS meditation
         FROM breaks
        WHERE user_id=$1`,
      [userId]
    );

    const sessions_completed = Number(sess.rows[0].sessions_completed || 0);
    const total_focus_seconds = Number(sess.rows[0].total_focus_seconds || 0);
    const avg_focus_seconds = Number(sess.rows[0].avg_focus_seconds || 0);

    const chai_count = br.rows[0]?.chai || 0;
    const meditation_count = br.rows[0]?.meditation || 0;
    const total_break_seconds = (chai_count * CHAI_MIN + meditation_count * MEDITATION_MIN) * 60;

    res.json({
      sessions_completed,
      total_focus_seconds,
      total_break_seconds,
      avg_focus_seconds,
    });
  } catch (e) {
    console.error("Stats error", e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;