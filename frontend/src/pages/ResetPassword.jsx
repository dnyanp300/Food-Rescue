import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setError("Missing or invalid reset link");
  }, [token]);

  const req = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }), [password]);

  const allOk = Object.values(req).every(Boolean) && password === confirm && !!token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allOk) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await authApi.confirmPasswordReset(token, password);
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border border-white/20">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <img src="/food-rescue-logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            </div>
            <CardTitle className="text-3xl font-bold">Reset password</CardTitle>
            <CardDescription>Choose a strong new password</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    disabled={loading}
                  />
                </div>
                <div className="text-xs space-y-1 mt-2">
                  <div className={`${req.length ? 'text-green-600' : 'text-gray-500'}`}>✓ At least 8 characters</div>
                  <div className={`${req.uppercase ? 'text-green-600' : 'text-gray-500'}`}>✓ One uppercase letter</div>
                  <div className={`${req.lowercase ? 'text-green-600' : 'text-gray-500'}`}>✓ One lowercase letter</div>
                  <div className={`${req.number ? 'text-green-600' : 'text-gray-500'}`}>✓ One number</div>
                  <div className={`${req.special ? 'text-green-600' : 'text-gray-500'}`}>✓ One special character (!@#$%^&*)</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pl-10 h-12"
                    disabled={loading}
                  />
                </div>
                {confirm && password !== confirm && (
                  <div className="text-xs text-red-600">Passwords do not match</div>
                )}
              </div>

              <Button type="submit" disabled={!allOk || loading} className="w-full h-12">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


