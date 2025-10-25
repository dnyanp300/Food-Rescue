import React, { useState } from "react";
import { donorApi, aiApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ChefHat, Package, MapPin, Clock } from "lucide-react";

export default function FoodForm({ onSubmission }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    location: "",
    pickup_time: "",
  });
  const [aiShelfLife, setAiShelfLife] = useState(null);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDescriptionBlur = async () => {
    if (formData.description) {
      try {
        const res = await aiApi.getShelfLife(formData.description);
        setAiShelfLife(`AI Est: ${res.shelf_life_estimation} (Warnings: ${res.warnings.join(', ')})`);
      } catch (err) {
        setAiShelfLife("Could not get AI estimation.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        pickup_time: new Date(formData.pickup_time).toISOString()
      };
      const newFoodItem = await donorApi.submitFood(dataToSubmit);
      toast({
        title: "Success!",
        description: "Food donation submitted successfully.",
      });
      onSubmission(newFoodItem);
      setFormData({ name: "", description: "", quantity: "", location: "", pickup_time: "" });
      setAiShelfLife(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/90 shadow-2xl border border-white/20 sticky top-24">
      {/* Gradient Header */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Submit Surplus Food
            </CardTitle>
            <p className="text-sm text-gray-500">Help reduce food waste today</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              Food Name
            </Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g., Veg Biryani" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-600" />
              Description
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="e.g., Cooked 2 hours ago, fresh and tasty..." 
              value={formData.description} 
              onChange={handleChange} 
              onBlur={handleDescriptionBlur}
              rows={3}
              className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {aiShelfLife && (
              <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {aiShelfLife}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                Quantity
              </Label>
              <Input 
                id="quantity" 
                name="quantity" 
                placeholder="e.g., 20 packets" 
                value={formData.quantity} 
                onChange={handleChange} 
                required
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Location
              </Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="e.g., Koramangala" 
                value={formData.location} 
                onChange={handleChange} 
                required
                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pickup_time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Pickup By
            </Label>
            <Input 
              id="pickup_time" 
              name="pickup_time" 
              type="datetime-local" 
              value={formData.pickup_time} 
              onChange={handleChange} 
              required
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-all duration-300 font-semibold py-6 text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Submit Donation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}