import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { LogOut } from "lucide-react";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  FoodRescue
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 hidden sm:block font-medium">
                    Hi, <span className="font-semibold text-green-700">{user.name}</span> 
                    <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full ml-2 font-medium">
                      {user.role.toUpperCase()}
                    </span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/login")} 
                    className="hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/register")} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition-all"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}