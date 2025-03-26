import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { twitService } from "../services/api";
import TwitForm from "../components/TwitForm";
import TwitList from "../components/TwitList";

export default function Home() {
  const [twits, setTwits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { variant } = queryString.parse(location.search);
  const isPopularView = variant === "most_liked";

  const fetchTwits = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = isPopularView 
        ? await twitService.getPopularTwits() 
        : await twitService.getAllTwits();
      
      setTwits(response.data);
    } catch (error) {
      console.error("Twit yükleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isPopularView]);

  useEffect(() => {
    fetchTwits();
  }, [fetchTwits]);

  const handleTwitCreated = () => {
    // Sadece son twitler görünümünde yenileyelim, popüler görünümde hemen etkilenmeyecek
    if (!isPopularView) {
      fetchTwits();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isPopularView ? "En Beğenilen Twitler" : "Son Twitler"}
      </h1>
      
      {!isPopularView && (
        <TwitForm onTwitCreated={handleTwitCreated} />
      )}
      
      <TwitList 
        twits={twits} 
        isLoading={isLoading}
        onTwitAction={() => fetchTwits()}
        emptyMessage={
          isPopularView 
            ? "Son 24 saatte beğenilen twit bulunmuyor" 
            : "Hiç twit bulunamadı"
        }
      />
    </div>
  );
} 