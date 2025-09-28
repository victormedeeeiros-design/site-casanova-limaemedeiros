import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BACKEND_URL } from '@/config';

export function AdminLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando token:', token); // Debug
      // Verificar token com o backend
      const response = await fetch(`${BACKEND_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Token inválido');

      localStorage.setItem('adminToken', token);
      navigate('/admin');
    } catch (err) {
      setError('Token inválido. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login Administrativo</CardTitle>
          <CardDescription>Digite o token de acesso para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Token de Administrador
              </label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o token de acesso"
                className="w-full"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={!token.trim()}>
              Entrar como Administrador
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}