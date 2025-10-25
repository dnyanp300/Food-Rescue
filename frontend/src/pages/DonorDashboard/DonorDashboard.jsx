import React, { useState, useEffect } from "react";
import { donorApi } from "@/services/api";
import FoodForm from "./FoodForm";
import DonorHistory from "./DonorHistory";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DonorDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await donorApi.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleNewSubmission = (newItem) => {
    setHistory([newItem, ...history]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-1">
        <FoodForm onSubmission={handleNewSubmission} />
      </div>
      <div className="lg:col-span-2">
        <DonorHistory history={history} />
      </div>
    </motion.div>
  );
}