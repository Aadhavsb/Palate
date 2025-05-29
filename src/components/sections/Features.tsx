import { Utensils, Sparkles, Clock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Advanced AI understands your cravings and creates personalized recipes tailored to your taste preferences and dietary needs."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Visual Recognition",
      description: "Upload any food image and our AI will identify ingredients and recreate the recipe with step-by-step instructions."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Instant Results",
      description: "Get complete recipes with ingredients, instructions, and cooking tips in under 30 seconds."
    }
  ]

  return (
    <section className="py-20 bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Palate?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of cooking with our intelligent recipe generation platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center group hover:bg-background-charcoal/50 transition-colors">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
