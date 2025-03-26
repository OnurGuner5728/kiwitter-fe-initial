import { useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    history.push("/login");
  };
  
  const isPopularView = location.search.includes("variant=most_liked");
  
  return (
    <div className="flex justify-between items-center">
      <div className="text-2xl font-bold text-lime-700">
        <Link to="/">Kiwitter</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {location.pathname === "/" && (
          <div className="flex space-x-2">
            <Link
              to="/"
              className={`px-3 py-1 rounded-full ${
                !isPopularView ? "bg-lime-700 text-white" : "bg-gray-200"
              }`}
            >
              Son Twitler
            </Link>
            <Link
              to="/?variant=most_liked"
              className={`px-3 py-1 rounded-full ${
                isPopularView ? "bg-lime-700 text-white" : "bg-gray-200"
              }`}
            >
              En Beğenilenler
            </Link>
          </div>
        )}
        
        {user && (
          <div className="flex items-center space-x-3">
            <Link 
              to={`/profile/${user.nickname}`} 
              className="flex items-center gap-2 hover:text-lime-700"
            >
              <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                <span className="text-lime-700 font-medium">{user.name.charAt(0)}</span>
              </div>
              <span>{user.nickname}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
            >
              Çıkış
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 