import express from "express";
import pool from "./db.mjs";

const router = express.Router();

router.get("/stats/:googleId", async (req, res) => {
  const { googleId } = req.params;

  try {
    const query = `
      select
          sum(s.duration_seconds) - coalesce(sum(extract(epoch from (b.ended_at - b.started_at))::int),0) as total_focus_seconds,
          coalesce(sum(extract(epoch from (b.ended_at - b.started_at))::int),0) as total_break_seconds,
          count(s.id) as sessions_completed,
          avg(s.duration_seconds - coalesce(extract(epoch from (b.ended_at - b.started_at))::int,0)) as avg_focus_seconds
      from sessions s
      left join breaks b on s.id = b.session_id
      where s.user_id = (select id from users where google_id=$1);
    `;

    const result = await pool.query(query, [googleId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;