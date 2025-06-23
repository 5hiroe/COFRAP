import { useState } from "react";
import api from '../api.js';
import { useNavigate } from "react-router-dom";
import TopRightNav from "../components/TopRightNav";

export default function ActivateMFA() {
  const [username, setUsername] = useState("");
  const [qrData, setQrData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('generate-2fa',
        { username },
    );
      setQrData(res.data.qrcode);
      setShowPopup(true);
    } catch (err) {
        console.error("Erreur axios :", err);
      setError("Erreur lors de la création du compte." + (err.response ? `: ${err.response.data}` : ''));
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-800 bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold">Activation de l'Authentification à Multiples Facteurs</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Activer
        </button>
      </form>

      {/* POPUP QR */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-center space-y-4">
            <h3 className="text-lg font-bold">Scannez ce QR Code</h3>
            <img src={qrData} alt="QR Code MFA" className="rounded shadow-lg border p-2 mx-auto" />
            <div className="space-y-2">
              <button
                onClick={() => window.open("https://support.google.com/accounts/answer/1066447", "_blank")}
                className="block w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                Comment se servir de l'authentification à multiples facteurs ?
              </button>
              <button
                onClick={() => navigate("/")}
                className="block w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Retour à la page de connexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
