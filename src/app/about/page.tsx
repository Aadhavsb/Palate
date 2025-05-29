'use client'

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
      title: "Professional Quality",
      description: "Get restaurant-quality recipes with detailed instructions, cooking times, and professional tips."
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
    { number: "10,000+", label: "Recipes Generated" },
    { number: "50+", label: "Cuisine Types" },
    { number: "5,000+", label: "Happy Users" },
    { number: "99%", label: "Success Rate" }
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "Culinary AI Specialist",
      description: "Former Michelin-starred chef with expertise in fusion cuisine and AI recipe development.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Food Technology Lead",
      description: "15+ years in food tech, specializing in nutrition analysis and dietary optimization.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Elena Kowalski",
      role: "UX Design Director",
      description: "Award-winning designer focused on making cooking accessible and enjoyable for everyone.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
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
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're revolutionizing home cooking with AI-powered recipe generation that understands your taste, 
              dietary needs, and culinary preferences to create the perfect dish every time.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                At Palate, we believe that everyone deserves access to delicious, personalized cooking experiences. 
                Our AI-powered platform breaks down barriers to culinary creativity by generating custom recipes 
                that match your exact preferences, dietary restrictions, and available ingredients.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Whether you're a beginner cook looking for simple meals or an experienced chef seeking inspiration, 
                Palate adapts to your skill level and creates recipes that are both achievable and exciting.
              </p>
              <div className="flex items-center space-x-4">
                <Heart className="w-8 h-8 text-orange-500" />
                <span className="text-lg text-white font-semibold">Made with passion for food lovers</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop" 
                alt="Cooking ingredients"
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
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Palate?</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the features that make Palate the most advanced AI recipe generator available today.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Food Lovers</h2>
            <p className="text-lg text-gray-400">Join thousands of users who have discovered their culinary passion with Palate.</p>
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
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our diverse team of culinary experts, technologists, and designers work together to bring you the best recipe generation experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-orange-500 mb-3">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-400">The principles that guide everything we do at Palate.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Safety First</h3>
              <p className="text-gray-400">
                We prioritize food safety and accurate allergen information in every recipe we generate.
              </p>
            </div>
            
            <div className="text-center">
              <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Inclusive Cooking</h3>
              <p className="text-gray-400">
                Our platform accommodates all dietary preferences, skill levels, and cultural backgrounds.
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
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Cooking?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join our community of food enthusiasts and discover your next favorite recipe today.
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
