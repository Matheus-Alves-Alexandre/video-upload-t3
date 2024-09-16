import { promises as fs } from "fs";
import { type NextApiRequest, type NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Lê todos os arquivos na pasta de uploads
      const files = await fs.readdir(uploadDir);

      // Retorna a lista de URLs dos arquivos
      const videoUrls = files.map((file) => `/uploads/${file}`);

      res.status(200).json({ videos: videoUrls });
    } catch (error) {
      res.status(500).json({ error: "Failed to load videos" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
