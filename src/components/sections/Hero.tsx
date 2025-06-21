import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-background-dark via-background-darker to-background-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Enjoy Our{' '}
              <span className="text-primary-500">Delicious</span>{' '}
              Meal
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Transform your culinary imagination into reality with AI-powered recipe generation. 
              From a simple description or photo, discover personalized recipes tailored to your taste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#generator" className="btn-primary text-lg px-8 py-4 text-center">
                Generate Recipe
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-4 text-center">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary-500">10K+</div>
                <div className="text-gray-400">Recipes Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500">5K+</div>
                <div className="text-gray-400">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500">50+</div>
                <div className="text-gray-400">Cuisines</div>
              </div>
            </div>
          </div>

          {/* Right Content - Food Image */}          <div className="relative">
            <div className="relative w-full h-96 lg:h-[600px] rounded-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/160929101749-essential-spanish-dish-paella-phaidon.jpg"
                alt="Essential Spanish dish paella"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Recipe Generated</div>
                  <div className="text-sm text-gray-600">In 30 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
