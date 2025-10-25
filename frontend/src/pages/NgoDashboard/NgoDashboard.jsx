import React, { useState, useEffect } from "react";
import { ngoApi } from "@/services/api";
import JobList from "./JobList";
import NgoHistory from "./NgoHistory";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export default function NgoDashboard() {
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [jobsData, historyData] = await Promise.all([
        ngoApi.getAvailableFood(),
        ngoApi.getHistory()
      ]);
      setJobs(jobsData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async (foodItemId) => {
    try {
      await ngoApi.claimFood(foodItemId);
      toast({ title: "Success", description: "Food claimed!" });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const handleUpdateStatus = async (claimId, status) => {
    try {
      await ngoApi.updateClaimStatus(claimId, status);
      toast({ title: "Success", description: `Claim updated to ${status}.` });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading NGO dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <JobList jobs={jobs} onClaim={handleClaim} />
      <div className="border-t border-gray-200 pt-8">
        <NgoHistory history={history} onUpdateStatus={handleUpdateStatus} />
      </div>
    </motion.div>
  );
}