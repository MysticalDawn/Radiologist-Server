import {supabase} from '../index.js'
import express from 'express'

const router = express.Router()

// Example scan numbers
const EXAMPLE_SCANS = [1, 2, 8];

// Testing endpoint
router.get("/testing", (req, res) => {
  res.json({ status: "okay" });
});

router.get("/get_example/:exampleNumber", async (req, res) => {
  const { exampleNumber } = req.params;
  const bucketName = "data";
  const scanNumber = parseInt(exampleNumber) * 50; // Convert example number to scan number
  
  try {
    // Get the image from example folder
    const { data: imageData, error: imageError } = await supabase.storage
      .from(bucketName)
      .download(`example_${exampleNumber}/img.png`);

    if (imageError) {
      console.error("Error getting image:", imageError);
      return res.status(404).json({ error: "Example image not found" });
    }

    // Get the report
    const { data: reportData, error: reportError } = await supabase.storage
      .from(bucketName)
      .download(`example_${exampleNumber}/report.pdf`);

    if (reportError) {
      console.error("Error getting report:", reportError);
      return res.status(404).json({ error: "Example report not found" });
    }

    // Get patient data from database
    const { data: patientData, error: patientError } = await supabase
      .from("Patients")
      .select("*")
      .eq("scan_number", scanNumber)
      .single();

    if (patientError) {
      console.error("Error getting patient data:", patientError);
      return res.status(404).json({ error: "Patient data not found" });
    }

    // Convert image to base64
    const imageBuffer = await imageData.arrayBuffer();
    const image_b64 = Buffer.from(imageBuffer).toString('base64');

    // Convert report to base64
    const reportBuffer = await reportData.arrayBuffer();
    const pdf_b64 = Buffer.from(reportBuffer).toString('base64');

    // Return the example data
    return res.json({
      ...patientData,
      img_b64: image_b64,
      pdf_b64: pdf_b64
    });

  } catch (err) {
    console.error("Error retrieving example:", err);
    return res.status(500).json({ error: `Error retrieving example: ${err.message}` });
  }
});

router.get("/get_report/:scanNumber", async (req, res) => {
  const { scanNumber } = req.params;
  const bucketName = "data";
  
  // Determine which path to use based on scan number
  let reportPath;
  if (scanNumber === "50") {
    reportPath = "example_1/report.pdf";
  } else if (scanNumber === "100") {
    reportPath = "example_2/report.pdf";
  } else if (scanNumber === "150") {
    reportPath = "example_3/report.pdf";
  } else {
    reportPath = `${scanNumber}/report.pdf`;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(reportPath);

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
