import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import RecipeGenerator from '@/components/recipe/RecipeGenerator'

export default function Home() {
  return (
    <>
      <Hero />
      <RecipeGenerator />
      <Features />
    </>
  )
}
