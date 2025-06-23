import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TopRightNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasToken, setHasToken] = useState(false);

  // Vérifie à chaque changement de page si le token est encore là
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token && token.trim() !== "");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setHasToken(false); // met à jour l'état local
    navigate("/");
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-4">
        
      <Link
        to="/"
        className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-100 transition"
      >
        
        🏠 Accueil
      </Link>
        
      {hasToken && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          🔒 Se déconnecter
        </button>
      )}
    </div>
  );
}
