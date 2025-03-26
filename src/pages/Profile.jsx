import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { userService } from "../services/api";
import TwitList from "../components/TwitList";

export default function Profile() {
  const [userTwits, setUserTwits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { nick } = useParams();

  const fetchUserTwits = useCallback(async () => {
    setIsLoading(true);
    try {
      // Normalde doğrudan userid'yi kullanırdık, 
      // ancak burada nickname üzerinden sorgu yapıyoruz,
      // API'nin bu şekilde desteklemesi gerekli
      const response = await userService.getUserTwits(nick);
      setUserTwits(response.data.twits);
      setUser(response.data.user);
    } catch (error) {
      console.error("Kullanıcı twitleri yükleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }, [nick]);

  useEffect(() => {
    fetchUserTwits();
  }, [fetchUserTwits]);

  return (
    <div>
      {user && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lime-700 font-bold text-2xl">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">@{user.nickname}</p>
            </div>
          </div>
          
          <div className="border-b border-gray-200 mt-4 mb-6"></div>
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-6">Twitler</h2>
      
      <TwitList 
        twits={userTwits} 
        isLoading={isLoading}
        onTwitAction={() => fetchUserTwits()}
        emptyMessage={`@${nick} henüz hiç twit paylaşmadı`}
      />
    </div>
  );
} 