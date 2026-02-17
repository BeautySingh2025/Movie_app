// controllers/movie_hall.controller.ts
import { Request, Response } from "express";
import pool from "../config/db";

// 1️⃣ Fetch hall_id using movie_id and show_date
export const getHallsByMovieAndDate = async (req: Request, res: Response) => {
  const { movie_id, show_date } = req.query;

  if (!movie_id || !show_date) {
    return res
      .status(400)
      .json({ message: "movie_id and show_date are required" });
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT DISTINCT hall_tb.id,hall_tb.hall_name,hall_tb.total_seats,hall_tb.location
       FROM showmoviehall_tb,hall_tb 
       WHERE showmoviehall_tb.hall_id = hall_tb.id AND movie_id = ? AND show_date = ?`,
      [movie_id, show_date],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Fetch slots (show time) based on hall_id and show_date
export const getSlotsByHallMovieAndDate = async (
  req: Request,
  res: Response,
) => {
  const { hall_id, movie_id, show_date } = req.query;

  if (!hall_id || !movie_id || !show_date) {
    return res.status(400).json({
      message: "hall_id, movie_id, and show_date are required",
    });
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT DISTINCT slot
       FROM showmoviehall_tb
       WHERE hall_id = ?
         AND movie_id = ?
         AND show_date = ?`,
      [hall_id, movie_id, show_date],
    );

    res.json(rows);
  } catch (err) {
    console.error("MYSQL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Fetch all details about a hall using hall_id
export const getHallDetailsById = async (req: Request, res: Response) => {
  const { hall_id } = req.params;

  if (!hall_id) {
    return res.status(400).json({ message: "hall_id is required" });
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT * FROM hall_tb WHERE id = ?`,
      [hall_id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// 4️⃣ Add a new show slot
export const addShowSlot = async (req: Request, res: Response) => {
  const { movie_id, hall_id, show_date, slot } = req.body;

  // ✅ Validate input
  if (!movie_id || !hall_id || !show_date || !slot) {
    return res
      .status(400)
      .json({ message: "movie_id, hall_id, show_date, and slot are required" });
  }

  // ✅ Optional: Validate slot value against enum
  const validSlots = ["11:00-14:00", "14:30-17:30", "18:00-21:00"];
  if (!validSlots.includes(slot)) {
    return res
      .status(400)
      .json({
        message: `Invalid slot. Valid options are: ${validSlots.join(", ")}`,
      });
  }

  try {
    // Insert new show slot
    const [result]: any = await pool.execute(
      `INSERT INTO showmoviehall_tb (movie_id, hall_id, show_date, slot, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [movie_id, hall_id, show_date, slot],
    );

    res
      .status(201)
      .json({ message: "Show slot added successfully", id: result.insertId });
  } catch (err: any) {
    console.error(err);
    // Handle duplicate slot for same hall, movie, and date
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({
          message: "This slot already exists for the given hall and date",
        });
    }
    res.status(500).json({ message: "Server error" });
  }
};
// 5️⃣ Fetch available show dates by movie_id (grouped)
export const getDatesByMovieId = async (req: Request, res: Response) => {
  const { movie_id } = req.query;

  if (!movie_id) {
    return res.status(400).json({ message: "movie_id is required" });
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT DISTINCT DATE_FORMAT(show_date, '%Y-%m-%d') AS show_date
        FROM showmoviehall_tb
        WHERE movie_id = ?
        ORDER BY show_date;`,
      [movie_id],
    );

    res.json(rows);
  } catch (err) {
    console.error("MYSQL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
