import { supabase } from "../index.js";
import express from "express";
const router = express.Router();
router.post("/populate/", async (req, res) => {
  try {
    const {
      name,
      id,
      admitted,
      urgency,
      alert,
      gender,
    } = req.body;
    const { error } = await supabase.from("Patients").insert({
      name,
      id,
      admitted,
      urgency,
      alert,
      gender,
      ai_prediction,
      ai_comment,
    });
    if (error) {
      console.log("error", error);
    } else {
      console.log("User added");
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
