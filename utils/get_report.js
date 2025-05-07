import {supabase} from '../index.js'
import express from 'express'

const router = express.Router()

router.get("/get_report/:scanNumber", async (req, res) => {
  const { scanNumber } = req.params;
  const bucketName = "data";
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(`${scanNumber}/report.pdf`);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(404).json({ error: "Report not found" });
    }

    if (!data) {
      console.error("No data received from Supabase");
      return res.status(404).json({ error: "No report data found" });
    }

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();
    
    // Set appropriate headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${scanNumber}_report.pdf"`
    );

    // Send the ArrayBuffer
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Error retrieving report:", err);
    return res.status(500).json({ error: `Error retrieving report: ${err.message}` });
  }
});

export default router;
