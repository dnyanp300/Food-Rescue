import React from "react";
import FoodCard from "@/components/FoodCard";
import { Heart } from "lucide-react";

export default function JobList({ jobs, onClaim }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Available Food Donations
        </h2>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-600 text-lg font-medium">No available food donations.</p>
          <p className="text-gray-500 text-sm mt-2">Check back later for new donations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((item, index) => (
            <FoodCard key={item.id} item={item} onClaim={onClaim} />
          ))}
        </div>
      )}
    </div>
  );
}