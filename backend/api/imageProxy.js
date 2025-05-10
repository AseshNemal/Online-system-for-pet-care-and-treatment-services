import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error.message, error.response?.status, error.response?.data);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
