import { IncomingForm } from "formidable";
import fs from "fs";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Necessário para processar arquivos
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const form = new IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Erro ao processar o arquivo" });

    const file = files.file[0];
    const fileStream = fs.createReadStream(file.filepath);

    try {
      const uploadRes = await cloudinary.v2.uploader.upload(fileStream.path, {
        folder: "uploads",
      });

      return res.status(200).json({ url: uploadRes.secure_url });
    } catch (error) {
      return res.status(500).json({ error: "Erro no upload para o Cloudinary" });
    }
  });
}
