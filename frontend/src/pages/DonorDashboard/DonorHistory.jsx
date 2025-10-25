import React from "react";
import FoodCard from "@/components/FoodCard";
import { History } from "lucide-react";

export default function DonorHistory({ history }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
          <History className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          My Submission History
        </h2>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg font-medium">You have not submitted any food yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start your journey to reduce food waste!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item, index) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}