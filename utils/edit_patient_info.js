import express from "express";
import cors from "cors"; // Import CORS
import { supabase } from "../index.js";

const router = express.Router();

// Enable CORS

// Increase payload size limit

router.post("/edit_info", async (req, res) => {
  const { ai_pred, ai_confidence, ai_comment } = req.body;
  const scanNumber = parseInt(req.query.scanNumber, 10);
  try {
    const { data, error } = await supabase
      .from("Patients")
      .update({
        alert: ai_pred,
        ai_pred: ai_pred,
        ai_confidence: ai_confidence,
        ai_comment: ai_comment,
      })
      .eq("scan_number", scanNumber);

    if (error) {
      return res
        .status(500)
        .send(`Error updating patient info: ${error.message}`);
    }

    res.status(200).send(`Patient info updated successfully`, data);
  } catch (error) {
    res.status(400).send(`Error updating patient info: ${error.message}`);
  }
});

export default router;
