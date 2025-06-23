import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-800 flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-sm text-center space-y-6">
        <h2 className="text-2xl font-bold mb-4">Bienvenue</h2>
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          🔐 Générer un mot de passe
        </button>
        <button
          onClick={() => navigate('/activate-mfa')}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          🔒 Activer l’authentification MFA
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          🔑 Se connecter
        </button>
      </div>
    </div>
  );
};

export default HomePage;
