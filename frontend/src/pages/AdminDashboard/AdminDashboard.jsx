import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/api';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, statsData] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getAnalytics()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await adminApi.verifyUser(userId);
      toast({ title: "Success", description: "User verified!" });
      // Refetch user data
      const usersData = await adminApi.getUsers();
      setUsers(usersData);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {stats && <Analytics initialStats={stats} />}
      <UserManagement users={users} onVerify={handleVerify} />
    </motion.div>
  );
}