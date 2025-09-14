import express from "express";
import pool from "./db.mjs";
import { ensureAuth } from "../middlewares/authentication.mjs";

const router = express.Router();

/**
 * Start a new work session
 */
router.post("/start", ensureAuth, async (req, res) => {
  try {
    const userRes = await pool.query(
      "SELECT id FROM users WHERE google_id = $1",
      [req.user.googleId]
    );
    const userId = userRes.rows[0].id;

    const result = await pool.query(
      `INSERT INTO sessions (user_id, started_at, status)
       VALUES ($1, NOW(), 'running')
       RETURNING id, user_id, started_at, status`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start session" });
  }
});

/**
 * Stop the current session
 */
router.post("/stop", ensureAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    // fetch session
    const sessionRes = await pool.query(
      `SELECT id, started_at, ended_at, status, duration_seconds
       FROM sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const sess = sessionRes.rows[0];

    // if already stopped, return existing duration (or compute from ended_at)
    if (sess.status === "stopped") {
      if (sess.duration_seconds != null) {
        return res.json({ message: "Already stopped", durationSeconds: sess.duration_seconds });
      }
      if (sess.ended_at) {
        const calcRes = await pool.query(
          `SELECT FLOOR(EXTRACT(EPOCH FROM (ended_at - started_at))) AS duration
           FROM sessions WHERE id = $1`,
          [sessionId]
        );
        const durationSeconds = Number(calcRes.rows[0].duration || 0);
        return res.json({ message: "Already stopped", durationSeconds });
      }
      return res.json({ message: "Already stopped", durationSeconds: null });
    }

    // compute duration up to now (in seconds)
    const durationRes = await pool.query(
      `SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) AS duration
       FROM sessions WHERE id = $1`,
      [sessionId]
    );

    const durationSeconds = Math.max(0, Math.floor(durationRes.rows[0].duration || 0));

    // update session row atomically
    await pool.query(
      `UPDATE sessions
       SET ended_at = NOW(), duration_seconds = $1, status = 'stopped'
       WHERE id = $2`,
      [durationSeconds, sessionId]
    );

    return res.json({ message: "Session stopped", durationSeconds });
  } catch (err) {
    console.error("Error stopping session:", err);
    return res.status(500).json({ error: "Failed to stop session" });
  }
});

/**
 * Record a break (just counters)
 */
router.post("/break", ensureAuth, async (req, res) => {
  try {
    const { type } = req.body; // 'meditation' or 'chai'

    const userRes = await pool.query(
      "SELECT id FROM users WHERE google_id = $1",
      [req.user.googleId]
    );
    const userId = userRes.rows[0].id;

    if (type === "meditation") {
      await pool.query(
        `INSERT INTO breaks (user_id, meditation_count, chai_count)
         VALUES ($1, 1, 0)
         ON CONFLICT (user_id) DO UPDATE
         SET meditation_count = breaks.meditation_count + 1`,
        [userId]
      );
    } else if (type === "chai") {
      await pool.query(
        `INSERT INTO breaks (user_id, meditation_count, chai_count)
         VALUES ($1, 0, 1)
         ON CONFLICT (user_id) DO UPDATE
         SET chai_count = breaks.chai_count + 1`,
        [userId]
      );
    }

    res.json({ message: "Break recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record break" });
  }
});

export default router;