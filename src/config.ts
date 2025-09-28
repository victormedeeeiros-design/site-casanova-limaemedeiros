// Detecta se está em produção baseado na URL atual
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// URL do backend - Configure NEXT_PUBLIC_BACKEND_URL após o deploy do backend
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  (isProduction ? 
    // Temporário: substitua pela URL real do seu backend após o deploy
    'https://backend-site-casanova-limaemedeiros.vercel.app' : 
    'http://localhost:3334'
  );

export const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123';