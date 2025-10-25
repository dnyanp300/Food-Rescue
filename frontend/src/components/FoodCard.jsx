import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// A reusable card for displaying food items
export default function FoodCard({ item, onClaim, onUpdateStatus }) {
  const isClaimable = item.status === 'pending' && onClaim;
  const isUpdatable = item.status === 'claimed' && onUpdateStatus;

  // Function to get gradient colors based on status
  const getStatusGradient = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30';
      case 'claimed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30';
      case 'delivered':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/30';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-xl bg-white/90 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
        {/* Gradient Header Bar */}
        <div className={`h-2 ${getStatusGradient(item.status).split(' ')[0]}`} />
        
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                {item.name}
              </CardTitle>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusGradient(item.status)}`}>
                <Sparkles className="w-3 h-3 inline mr-1" />
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            </div>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-3 line-clamp-2">
            {item.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
              <Package className="w-5 h-5 mr-3 text-green-600" />
              <span className="text-gray-600">Quantity:</span>
              <span className="ml-2 font-bold text-green-700">{item.quantity}</span>
            </div>
            
            <div className="flex items-center text-sm font-medium text-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
              <MapPin className="w-5 h-5 mr-3 text-orange-600" />
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-bold text-orange-700">{item.location}</span>
            </div>
            
            <div className="flex items-center text-sm font-medium text-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
              <Clock className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-gray-600">Pickup By:</span>
              <span className="ml-2 font-bold text-blue-700">
                {new Date(item.pickup_time).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          {isClaimable && (
            <Button
              onClick={() => onClaim(item.id)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-all duration-300 font-semibold"
            >
              🎯 Claim Food
            </Button>
          )}
          {isUpdatable && (
            <div className="flex w-full space-x-3">
              <Button
                onClick={() => onUpdateStatus(item.claim_id, 'delivered')}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-all duration-300 font-semibold"
              >
                ✅ Mark Delivered
              </Button>
              <Button
                onClick={() => onUpdateStatus(item.claim_id, 'cancelled')}
                variant="destructive"
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/30 transition-all duration-300 font-semibold"
              >
                ❌ Cancel
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}