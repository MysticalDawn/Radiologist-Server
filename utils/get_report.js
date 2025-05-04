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
      return res.status(404).send(error.message);
    }

    // Set appropriate headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${scanNumber}_report.pdf"`
    );

    // Pipe the readable stream to the response
    data.pipe(res);
  } catch (err) {
    return res.status(500).send(`Error retrieving report: ${err.message}`);
  }
});

export default router;
