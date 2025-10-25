import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "donor",
    location: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await register(formData);
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
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
        <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border border-white/20 hover:shadow-orange-200/50 transition-all duration-300">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center animate-float shadow-lg shadow-orange-500/30">
                <span className="text-4xl">❤️</span>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Join FoodRescue
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Start your journey to reduce food waste today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center text-sm">{error}</div>}
              {success && <div className="bg-green-100 text-green-700 p-3 rounded-md text-center text-sm">{success}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="m@example.com" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Your Location (e.g., Koramangala)</Label>
                <Input id="location" name="location" required placeholder="Koramangala" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>I am a...</Label>
                <Select name="role" value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Donor (Restaurant/Individual)</SelectItem>
                    <SelectItem value="ngo">NGO / Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-300"
              >
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p>Already have an account? 
              <Link to="/login" className="ml-1 font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}