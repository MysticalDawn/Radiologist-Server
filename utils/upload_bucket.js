import express from "express";
import { supabase } from "../index.js";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/upload_img/:folderName", async (req, res) => {
  const { folderName } = req.params;
  const { fileContent } = req.body;
  const fileName = folderName

  try {
    if (!fileContent || !fileName) {
      return res.status(400).send("File content and file name are required.");
    }

    // Decode base64 content
    const buffer = Buffer.from(fileContent, "base64");

    // Upload the decoded file directly to the storage bucket
    const { data, error } = await supabase.storage
      .from("data")
      .upload(`${folderName}/${fileName}`, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/png", // Adjust content type if needed
      });

    if (error) {
      return res.status(500).send(`Error uploading file: ${error.message}`);
    }

    res.status(200).send({ message: `File uploaded successfully to ${folderName}`, data });
  } catch (error) {
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

export default router;
