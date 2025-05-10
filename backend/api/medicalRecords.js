import { connect } from "../src/utils/database.connection.js";
import MedicalRecord from "../src/API/model/MedicalRecord.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "POST":
        if (path === "/api/medicalRecords/") {
          const { petId, visitDate, visitType, veterinarian, diagnosis, treatment, medications, notes } = body;
          const newRecord = new MedicalRecord({
            petId,
            visitDate: visitDate || Date.now(),
            visitType,
            veterinarian,
            diagnosis,
            treatment,
            medications: medications || [],
            notes
          });
          const savedRecord = await newRecord.save();
          return res.status(201).json(savedRecord);
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "GET":
        if (path.startsWith("/api/medicalRecords/single/")) {
          const id = path.split("/").pop();
          const record = await MedicalRecord.findById(id);
          if (!record) return res.status(404).json({ error: "Record not found" });
          return res.status(200).json(record);
        } else if (path.startsWith("/api/medicalRecords/")) {
          const petId = path.split("/").pop();
          const records = await MedicalRecord.find({ petId }).sort({ visitDate: -1 });
          return res.status(200).json(records);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "PUT":
        if (path.startsWith("/api/medicalRecords/")) {
          const id = path.split("/").pop();
          const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, body, { new: true });
          if (!updatedRecord) return res.status(404).json({ error: "Record not found" });
          return res.status(200).json(updatedRecord);
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      case "DELETE":
        if (path.startsWith("/api/medicalRecords/delete/")) {
          const id = path.split("/").pop();
          const deletedRecord = await MedicalRecord.findByIdAndDelete(id);
          if (!deletedRecord) return res.status(404).json({ error: "Record not found" });
          return res.status(200).json({ message: "Record deleted successfully" });
        }
        return res.status(400).json({ error: "Invalid DELETE request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
