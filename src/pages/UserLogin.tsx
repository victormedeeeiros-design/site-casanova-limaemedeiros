import React from 'react';
import { UserAuth } from '@/components/UserAuth';

const UserLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo!
          </h2>
          <p className="text-gray-600">
            Entre com sua conta para uma experiência personalizada
          </p>
        </div>
        <UserAuth />
      </div>
    </div>
  );
};

export default UserLogin;