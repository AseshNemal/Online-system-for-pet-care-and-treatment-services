import { connect } from "../src/utils/database.connection.js";
import Pet from "../src/API/model/pet.js";

export default async function handler(req, res) {
  await connect();

  const { method, url } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "GET":
        if (path === "/api/pet-tracker/") {
          const pets = await Pet.find();
          return res.status(200).json(pets);
        } else if (path.startsWith("/api/pet-tracker/find/")) {
          const userId = path.split("/").pop();
          const pets = await Pet.find({ userId });
          if (!pets || pets.length === 0) {
            return res.status(404).json({ status: "No pets found for this user" });
          }
          return res.status(200).json({ status: "Pets fetched", pets });
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "DELETE":
        if (path.startsWith("/api/pet-tracker/delete/")) {
          const petid = path.split("/").pop();
          await Pet.findByIdAndDelete(petid);
          return res.status(200).json({ status: "User deleted" });
        }
        return res.status(400).json({ error: "Invalid DELETE request" });

      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
