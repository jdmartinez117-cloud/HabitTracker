import React, { useState } from 'react';
import { DEFAULT_USER_CREDENTIALS } from '../constants';
import { Lock, User, ChevronRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.toLowerCase() === DEFAULT_USER_CREDENTIALS.username &&
      password === DEFAULT_USER_CREDENTIALS.password
    ) {
      onLoginSuccess();
    } else {
      setError('❌ Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-500">Inicia sesión en Habit Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="usuario">
              Usuario
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="usuario"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ingresa 'juan'"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="contrasena">
              Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="contrasena"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ingresa '123'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-center text-sm font-semibold text-red-500 animate-pulse">{error}</p>}

          <button
            type="submit"
            className="group flex w-full justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Entrar
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
           Credenciales demo: juan / 123
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;