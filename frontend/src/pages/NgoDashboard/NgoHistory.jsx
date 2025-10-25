import React from "react";
import FoodCard from "@/components/FoodCard";
import { ClipboardList } from "lucide-react";

export default function NgoHistory({ history, onUpdateStatus }) {
  const adaptedHistory = history.map(claim => ({
      ...claim.food_item,
      status: claim.status,
      claim_id: claim.id,
  }));
  
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          My Claim History
        </h2>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-gray-600 text-lg font-medium">You have not claimed any food yet.</p>
          <p className="text-gray-500 text-sm mt-2">Browse available donations above to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adaptedHistory.map((item, index) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onUpdateStatus={onUpdateStatus} 
            />
          ))}
        </div>
      )}
    </div>
  );
}