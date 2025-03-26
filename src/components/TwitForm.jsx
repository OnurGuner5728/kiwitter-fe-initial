import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { twitService } from "../services/api";

export default function TwitForm({ onTwitCreated, replyTo = null }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      showNotification("Twit içeriği boş olamaz", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (replyTo) {
        // Yanıt oluştur
        await twitService.replyToTwit(replyTo, content);
        showNotification("Yanıtınız gönderildi", "success");
      } else {
        // Yeni twit oluştur
        await twitService.createTwit(content);
        showNotification("Twitiniz paylaşıldı", "success");
      }
      
      setContent("");
      
      if (onTwitCreated) {
        onTwitCreated();
      }
    } catch (error) {
      console.error("Twit oluşturma hatası:", error);
      showNotification(
        error.response?.data?.message || "Twit oluşturulurken bir hata oluştu",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lime-700 font-medium">{user?.name?.charAt(0)}</span>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-lime-500 focus:border-lime-500 focus:outline-none"
              rows="3"
              placeholder={replyTo ? "Yanıtınızı yazın..." : "Ne düşünüyorsun?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/280
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-lime-700 text-white rounded-full font-medium disabled:opacity-50"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? "Gönderiliyor..." : replyTo ? "Yanıtla" : "Tweetle"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 