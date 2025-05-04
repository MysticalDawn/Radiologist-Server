import { supabase } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/fetch_all", async (req, res) => {
  try {
    const { data, error } = await supabase.from("Patients").select("*");
    if (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ error: "Failed to fetch patients" });
    }

    // Set CORS headers (if not already handled globally in `index.js`)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

export default router;