import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Utensils, BarChart3, Shield, Heart, AlertCircle } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header with Logo placeholder */}
      <header className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/food-rescue-concept.png" 
              alt="Food Rescue Logo" 
              className="h-12 w-12 object-contain rounded-xl shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl items-center justify-center shadow-lg hidden">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Food Rescue
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Close the Gap.
                </span>
                <br />
                <span className="text-gray-700">End Hunger.</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Stop Waste.
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect surplus food from restaurants and events with NGOs that feed those in need. 
                Together, we can make a difference, one meal at a time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg px-8">
                  Join the Mission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image placeholder - will be replaced with actual image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/food-rescue-logo.png"
                alt="Food Rescue - Connecting Food Waste with Hunger"
                className="w-full h-auto object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-gradient-to-br from-green-400 to-teal-500 p-16 rounded-2xl text-white items-center justify-center">
                <div className="text-center space-y-4">
                  <span className="text-6xl block">🌍</span>
                  <p className="text-xl font-bold">Food Rescue Mission</p>
                  <p className="text-green-50">Connecting surplus food with communities in need</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <h3 className="text-3xl font-bold text-gray-900">The Problem We Solve</h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card className="p-6 border-orange-200 bg-orange-50">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">🥘 Food Waste</h4>
              <p className="text-gray-700">
                Every day, restaurants and events throw away tons of perfectly good food while 
                millions go hungry. This waste contributes to climate change and economic loss.
              </p>
            </Card>
            <Card className="p-6 border-red-200 bg-red-50">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">👥 People in Need</h4>
              <p className="text-gray-700">
                Hunger affects families, children, and the homeless in our communities. 
                NGOs work tirelessly to feed them but struggle to find consistent food sources.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-gray-900">How Food Rescue Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, smart platform connecting food donors with those who need it most
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="w-8 h-8" />,
                title: "1. Donate Food",
                description: "Restaurants and individuals post surplus food with details like type, quantity, and pickup time.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "2. NGOs Claim",
                description: "NGOs browse available food and claim what they need for their programs.",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "3. Feed Communities",
                description: "Food reaches those in need through verified NGO networks.",
                color: "from-pink-500 to-rose-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-green-500">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features for Each Role */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-gray-900">Designed for Everyone</h3>
            <p className="text-xl text-gray-600">How each role benefits from Food Rescue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* For Donors */}
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Utensils className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">For Donors</h4>
                  <p className="text-gray-600">Restaurants & Individuals</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Reduce food waste and save money on disposal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Easy posting with clear details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Track your donations and impact</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Transparent matching and pickup coordination</span>
                </li>
              </ul>
            </Card>

            {/* For NGOs */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">For NGOs</h4>
                  <p className="text-gray-600">Non-Profits & Volunteers</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Browse and claim available food instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Filter by location and food type</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Track your rescue history and impact</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Manage multiple pickups efficiently</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* For Admins */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">For Administrators</h4>
                <p className="text-gray-600">Platform Management</p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Verify and approve NGO registrations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Monitor platform analytics and impact</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Manage user accounts and security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Generate reports on food rescue data</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </section>

      {/* Impact Stats removed per request */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <Card className="p-12 bg-gradient-to-br from-green-600 to-teal-600 text-white border-0 shadow-2xl">
            <h3 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h3>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Join thousands of people already fighting hunger and reducing waste in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600 space-y-2">
          <p className="font-semibold text-gray-800">Food Rescue Platform</p>
          <p>Connecting Food • Ending Hunger • Reducing Waste</p>
          <div className="pt-4 space-y-1">
            <p className="text-sm text-gray-700">
              Contact: <span className="font-medium text-gray-900">Dnyan Patil</span>
            </p>
            <p className="text-sm text-gray-700">Phone: <a href="tel:6363796961" className="underline">6363796961</a></p>
            <p className="text-sm text-gray-700">
              LinkedIn: <a href="https://www.linkedin.com/in/dnyanpatil/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/dnyanpatil/</a>
            </p>
          </div>
          <p className="text-sm pt-4">© 2025 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

