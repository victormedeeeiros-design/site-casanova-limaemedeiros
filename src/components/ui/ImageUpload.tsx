import React, { useState } from 'react';
import axios from 'axios';

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      onUploadSuccess(response.data.url);
    } catch (error) {
      console.error('Erro no upload:', error);
      onUploadError('Falha ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label 
        htmlFor="image-upload" 
        className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        {uploading ? 'Enviando...' : 'Selecionar Imagem'}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};