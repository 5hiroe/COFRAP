import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-800 bg-cover bg-center flex items-center justify-center">
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* 🎞️ GIF centré */}
      <img
        src="/img/danse.gif"
        alt="Dashboard animation"
        className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] object-contain mb-6"
      />
    </div>
    </div>
  );
};

export default Dashboard;
