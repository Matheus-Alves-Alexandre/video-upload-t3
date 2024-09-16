import { IncomingForm, type File } from "formidable";
import { promises as fs } from "fs";
import { type NextApiRequest, type NextApiResponse } from "next";
import path from "path";

// Desativa o bodyParser padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Função para salvar o arquivo
const uploadFile = async (
  req: NextApiRequest,
): Promise<{ filename: string }> => {
  const form = new IncomingForm({
    keepExtensions: true, // Mantém a extensão do arquivo original
    multiples: false, // Não permite múltiplos arquivos
  });

  const uploadDir = path.join(process.cwd(), "public", "uploads"); // Pasta de destino

  // Garante que a pasta de uploads exista
  await fs.mkdir(uploadDir, { recursive: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const file = files.video as File; // Verifica se o arquivo existe
      if (!file) {
        return reject(new Error("Nenhum arquivo enviado"));
      }

      const tempPath = file.filepath || file.path; // Pega o caminho temporário do arquivo
      const fileName = `${Date.now()}-${file.originalFilename}`; // Gera um nome para o arquivo
      const targetPath = path.join(uploadDir, fileName); // Define o caminho de destino

      try {
        // Move o arquivo para a pasta de destino
        await fs.rename(tempPath, targetPath);
        resolve({ filename: fileName });
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Handler principal da API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { filename } = await uploadFile(req);
      res.status(200).json({ message: "Upload feito com sucesso", filename });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
