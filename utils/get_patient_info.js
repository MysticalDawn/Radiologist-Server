import { supabase } from "../index.js";
import express from "express";

const router = express.Router();

router.get("/get_patient_info", async (req, res) => {
  const scanNumber = parseInt(req.query.scanNumber, 10);
  try {
    const { data, error } = await supabase
      .from("Patients")
      .select("*")
      .eq("scan_number", scanNumber)
      .single(); // Fetch a single record

    if (error) {
      console.error(error);
      return res.status(404).send("Patient not found");
    }

    res.status(200).send(data); // Send the data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
