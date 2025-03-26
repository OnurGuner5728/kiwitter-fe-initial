import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { twitService } from "../services/api";

export default function TwitItem({ twit, onTwitAction = null, showActionButtons = true }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [twitData, setTwitData] = useState(twit);
  const { user } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await twitService.likeTwit(twitData._id);
      // Like sayısını güncelle
      setTwitData(prev => ({ 
        ...prev, 
        likes: prev.likes + 1,
        likedByMe: true
      }));
      showNotification("Twit beğenildi", "success");
      
      if (onTwitAction) {
        onTwitAction("like", twitData._id);
      }
    } catch (error) {
      console.error("Beğeni hatası:", error);
      showNotification(
        error.response?.data?.message || "Twit beğenilirken bir hata oluştu",
        "error"
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (!window.confirm("Bu twiti silmek istediğinize emin misiniz?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await twitService.deleteTwit(twitData._id);
      showNotification("Twit silindi", "success");
      
      if (onTwitAction) {
        onTwitAction("delete", twitData._id);
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      showNotification(
        error.response?.data?.message || "Twit silinirken bir hata oluştu",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: tr 
    });
  };
  
  const canDelete = user && (user._id === twitData.userId || user.role === 'admin');
  
  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lime-700 font-medium">{twitData.user.name.charAt(0)}</span>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${twitData.user.nickname}`} className="font-semibold hover:underline">
              {twitData.user.name}
            </Link>
            <span className="text-gray-500">@{twitData.user.nickname}</span>
            <span className="text-gray-500 text-sm">·</span>
            <time className="text-gray-500 text-sm" dateTime={twitData.createdAt}>
              {formatDate(twitData.createdAt)}
            </time>
          </div>
          
          <div className="mt-2 whitespace-pre-wrap">
            {twitData.content}
          </div>
          
          {showActionButtons && (
            <div className="mt-3 flex items-center gap-6">
              <Link to={`/detail/${twitData._id}`} className="text-gray-500 hover:text-lime-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
                <span>{twitData.replies || 0}</span>
              </Link>
              
              <button 
                className={`flex items-center gap-1 ${twitData.likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                onClick={handleLike}
                disabled={isLiking || twitData.likedByMe}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={twitData.likedByMe ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span>{twitData.likes || 0}</span>
              </button>
              
              {canDelete && (
                <button 
                  className="text-red-500 hover:text-red-700 ml-auto"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 