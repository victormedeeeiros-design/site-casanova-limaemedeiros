import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import multer from 'multer';
import path from 'path';

// Configurar multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
}).single('image');

export const uploadController = {
  async uploadImage(req: Request, res: Response) {
    return new Promise((resolve) => {
      upload(req, res, async (err) => {
        if (err) {
          console.error('Erro no upload:', err);
          res.status(400).json({ error: err.message });
          return resolve(undefined);
        }

        try {
          const file = req.file;
          if (!file) {
            res.status(400).json({ error: 'Nenhum arquivo enviado' });
            return resolve(undefined);
          }

          // Gerar nome único para o arquivo
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;

          // Upload para o Supabase Storage
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          // Gerar URL pública
          const { data: publicUrl } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          res.json({ url: publicUrl.publicUrl });
        } catch (error) {
          console.error('Erro no upload para Supabase:', error);
          res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
        }
        resolve(undefined);
      });
    });
  },

  async deleteImage(req: Request, res: Response) {
    try {
      const { fileName } = req.params;

      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) throw error;

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      res.status(500).json({ error: 'Erro ao deletar imagem' });
    }
  }
};