import { createClient } from "@supabase/supabase-js";
import express from "express";
import upload_bucket from "./utils/upload_bucket.js";
import populateHandler from "./utils/populate.js";
import getReport from "./utils/get_report.js";
import cors from "cors";
import getPatientInfo from "./utils/get_patient_info.js";
import editPatientInfo from "./utils/edit_patient_info.js";
import fetchAllPatients from "./utils/fetch_all_patients.js";
const supabaseUrl = "https://qovdajdgfroylctrsiyh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdmRhamRnZnJveWxjdHJzaXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQ5NDM2MywiZXhwIjoyMDU2MDcwMzYzfQ.HJVrLt-IvC3PaBC4MmrL9ElQWYibLDJu0HuMD-n9Dlg";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());
app.use(cors({origin : ""}));
app.use(cors({ origin: "https://radiology-website-zeta.vercel.app" }));
app.use("/", upload_bucket);
app.use("/", populateHandler);
app.use("/", getReport);
app.use("/", getPatientInfo);
app.use("/", editPatientInfo);
app.use("/", fetchAllPatients);


export default app;
export { supabase };
