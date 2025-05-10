import { db } from "../src/utils/firebase.js";

export default async function handler(req, res) {
  if (req.method === "GET" && req.url === "/api/data/pets") {
    try {
      const snapshot = await db.collection("pets").get();
      const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
