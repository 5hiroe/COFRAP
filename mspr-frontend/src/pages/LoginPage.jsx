import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code2fa, setCode2FA] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('login', { username, password, code2fa });
      const gendate = Date.now();
      const token = btoa(`${username}:${gendate}`);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
       const errorMessage = err?.response?.data?.error || "Erreur inconnue";

      if (errorMessage.includes("Account expired")) {
        alert("Votre compte est expiré. Merci de générer un nouveau mot de passe.");
        navigate("/register");
      } else {
        alert("Erreur de connexion : " + errorMessage);
      }
    }
  };

  return (
    <div
      className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-800 bg-cover bg-center flex items-center justify-center"
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="text"
            placeholder="Code MFA"
            value={code2fa}
            onChange={(e) => setCode2FA(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Créer un compte
            </button>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
