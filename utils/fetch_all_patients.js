import { supabase } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/fetch_all", async (req, res) => {
  try {
    const { data, error } = await supabase.from("Patients").select("*"); // Added `await`
    if (error) {
      console.error("Error fetching patients:", error); // Improved error logging
      return res.status(500).send({ error: "Failed to fetch patients" }); // Added `return`
    }
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or your specific domain
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.status(200).send(data);
  } catch (error) {
    console.error("Unexpected error:", error); // Improved error logging
    res.status(500).send({ error: "Unexpected server error" }); // Changed status to 500 for server errors
  }
});

export default router;
