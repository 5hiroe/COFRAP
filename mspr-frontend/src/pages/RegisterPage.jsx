import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('generate-password',
        { username },
    );
      setResponse(res.data);
    } catch (err) {
        console.error("Erreur axios :", err);
      setError("Erreur lors de la création du compte." + (err.response ? `: ${err.response.data}` : ''));
    }
  };

  const handleActivate = () => {
    alert('MFA activé avec succès (démo)');
    // Tu peux ici appeler /function/generate-2fa ou rediriger
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-800 bg-cover bg-center flex items-center justify-center" >
       <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {!response ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Créer un compte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom d’utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Générer le QR Code
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">Scannez le QR Code pour obtenir vos identifiants</h2>
            <img src={response.qrcode} alt="QR Code" className="mx-auto" />
            <button
              onClick={() => navigate('/activate-mfa')}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Activer l’authentification à multiple facteurs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
