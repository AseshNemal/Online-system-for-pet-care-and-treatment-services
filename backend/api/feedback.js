import { connect } from "../src/utils/database.connection.js";
import Feedback from "../src/API/model/Feedback.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "POST":
        if (path === "/api/feedback/add") {
          const { userId, userName, feedback, rating } = body;
          const newFeedback = new Feedback({ userId, userName, feedback, rating });
          await newFeedback.save();
          return res.status(201).json(newFeedback);
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "GET":
        if (path === "/api/feedback/all") {
          const feedbacks = await Feedback.find().sort({ createdAt: -1 });
          return res.status(200).json(feedbacks);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "DELETE":
        if (path.startsWith("/api/feedback/delete/")) {
          const id = path.split("/").pop();
          const feedback = await Feedback.findById(id);
          if (!feedback) {
            return res.status(404).json({ error: "Feedback not found." });
          }
          await feedback.deleteOne();
          return res.status(200).json({ message: "Feedback deleted successfully." });
        }
        return res.status(400).json({ error: "Invalid DELETE request" });

      case "PUT":
        if (path.startsWith("/api/feedback/edit/")) {
          const id = path.split("/").pop();
          const { feedback, rating } = body;
          const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { feedback, rating },
            { new: true }
          );
          if (!updatedFeedback) {
            return res.status(404).json({ error: "Feedback not found." });
          }
          return res.status(200).json(updatedFeedback);
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
