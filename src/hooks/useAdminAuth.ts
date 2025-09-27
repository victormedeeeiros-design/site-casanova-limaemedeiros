import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/admin/login');
      return;
    }

    // Verificar token com o backend
    fetch('http://localhost:3333/admin/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Token inválido');
      setIsAuthenticated(true);
    })
    .catch(() => {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      navigate('/admin/login');
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [navigate]);

  return { isAuthenticated, isLoading };
};