import { useState, useEffect } from "react";
import TwitItem from "./TwitItem";

export default function TwitList({ twits, onTwitAction, isLoading, emptyMessage = "Hiç twit bulunamadı" }) {
  const [filteredTwits, setFilteredTwits] = useState([]);
  
  useEffect(() => {
    if (twits) {
      setFilteredTwits(twits);
    }
  }, [twits]);
  
  const handleTwitAction = (actionType, twitId) => {
    if (actionType === "delete") {
      // Silinen twiti listeden kaldır
      setFilteredTwits(prev => prev.filter(twit => twit._id !== twitId));
    }
    
    if (onTwitAction) {
      onTwitAction(actionType, twitId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-700"></div>
      </div>
    );
  }
  
  if (!filteredTwits || filteredTwits.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {filteredTwits.map(twit => (
        <TwitItem 
          key={twit._id} 
          twit={twit}
          onTwitAction={handleTwitAction}
        />
      ))}
    </div>
  );
} 