import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { twitService } from "../services/api";
import TwitItem from "../components/TwitItem";
import TwitForm from "../components/TwitForm";
import TwitList from "../components/TwitList";

export default function TwitDetail() {
  const [twit, setTwit] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { twitId } = useParams();

  const fetchTwitDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await twitService.getTwitDetails(twitId);
      setTwit(response.data.twit);
      setReplies(response.data.replies || []);
    } catch (error) {
      console.error("Twit detay yükleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }, [twitId]);

  useEffect(() => {
    fetchTwitDetails();
  }, [fetchTwitDetails]);

  const handleReplyCreated = () => {
    // Yeni yanıt geldiğinde sayfayı yenile
    fetchTwitDetails();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  if (!twit) {
    return (
      <div className="text-center py-20 text-gray-500">
        Twit bulunamadı veya silinmiş olabilir.
      </div>
    );
  }

  return (
    <div>
      <div className="border border-gray-200 rounded-lg mb-6">
        <TwitItem twit={twit} showActionButtons={false} />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Yanıt Yaz</h2>
        <TwitForm replyTo={twitId} onTwitCreated={handleReplyCreated} />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Yanıtlar</h2>
        <TwitList 
          twits={replies} 
          isLoading={false}
          onTwitAction={() => fetchTwitDetails()}
          emptyMessage="Bu twite henüz yanıt verilmemiş"
        />
      </div>
    </div>
  );
} 