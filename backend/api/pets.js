import { connect } from "../src/utils/database.connection.js";
import Pet from "../src/API/model/pet.js";

export default async function handler(req, res) {
  await connect();

  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.petId) {
          // GET /api/pets?petId=...
          const pet = await Pet.findById(query.petId);
          if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
          }
          return res.status(200).json({ pet });
        } else if (query.uid) {
          // GET /api/pets?uid=...
          const pets = await Pet.find({ userId: query.uid });
          if (!pets || pets.length === 0) {
            return res.status(404).json({ status: "No pets found for this user" });
          }
          return res.status(200).json({ status: "Pets fetched", pets });
        } else {
          // GET /api/pets
          const pets = await Pet.find();
          return res.status(200).json(pets);
        }

      case "POST":
        if (req.url.endsWith("/add")) {
          const newPet = new Pet(body);
          await newPet.save();
          return res.status(201).json("Pet Added");
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "PUT":
        if (query.id) {
          const pet = await Pet.findByIdAndUpdate(query.id, body, {
            new: true,
            runValidators: true,
          });
          if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
          }
          return res.status(200).json({ status: "Pet Updated", pet });
        }
        return res.status(400).json({ error: "Missing pet id for update" });

      case "DELETE":
        if (query.id) {
          await Pet.findByIdAndDelete(query.id);
          return res.status(200).json({ status: "Pet deleted" });
        }
        return res.status(400).json({ error: "Missing pet id for delete" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
