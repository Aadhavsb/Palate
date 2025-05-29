'use client'

import Image from 'next/image'
import { ChefHat, Sparkles, Users, Heart, Target, Award, Globe, Shield } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Advanced OpenAI technology analyzes your inputs to create personalized recipes tailored to your preferences."
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "High-Quality Recipes",
      description: "Get detailed recipes with step-by-step instructions, cooking times, and helpful cooking tips."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Dietary Customization",
      description: "Filter recipes based on allergies, dietary restrictions, and spice preferences for safe cooking."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Cuisines",
      description: "Explore recipes from around the world with authentic flavors and cooking techniques."
    }
  ]

  const stats = [
    { number: "200+", label: "Recipes Generated" },
    { number: "25+", label: "Cuisine Types" },
    { number: "50+", label: "Happy Users" },
    { number: "90%", label: "Success Rate" }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-orange-500">Palate</span>
            </h1>            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A student project exploring AI-powered recipe generation that understands your taste, 
              dietary needs, and culinary preferences to create personalized recipes.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>              <h2 className="text-3xl font-bold text-white mb-6">Project Goal</h2>
              <p className="text-lg text-gray-300 mb-6">
                Palate is a student project that explores how AI can make cooking more accessible and personalized. 
                This platform demonstrates how modern technology can break down barriers to culinary creativity by generating custom recipes 
                that match your exact preferences, dietary restrictions, and available ingredients.
              </p>              <p className="text-lg text-gray-300 mb-8">
                Whether you&apos;re a beginner cook looking for simple meals or someone seeking culinary inspiration, 
                Palate adapts to your needs and creates recipes that are both achievable and exciting.
              </p>
              <div className="flex items-center space-x-4">
                <Heart className="w-8 h-8 text-orange-500" />
                <span className="text-lg text-white font-semibold">Built with passion for learning and food</span>
              </div>
            </div>            <div className="relative">
              <Image 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop" 
                alt="Cooking ingredients"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Palate?</h2>            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the features that make this AI recipe generator an exciting exploration of modern technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Project Statistics</h2>
            <p className="text-lg text-gray-400">See what this student project has accomplished so far.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>      {/* Values Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Project Principles</h2>
            <p className="text-lg text-gray-400">The principles that guide this student project.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Safety First</h3>              <p className="text-gray-400">
                This project prioritizes food safety and accurate allergen information in every recipe generated.
              </p>
            </div>
            
            <div className="text-center">
              <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Inclusive Cooking</h3>              <p className="text-gray-400">
                The platform accommodates all dietary preferences, skill levels, and cultural backgrounds.
              </p>
            </div>
            
            <div className="text-center">
              <Award className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Quality Excellence</h3>
              <p className="text-gray-400">
                Every recipe is crafted with attention to flavor balance, nutrition, and cooking techniques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Cooking?</h2>          <p className="text-lg text-gray-400 mb-8">
            Explore this AI-powered recipe generator and discover your next favorite recipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Generate Your First Recipe
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
