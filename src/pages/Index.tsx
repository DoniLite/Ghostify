import { useLocation } from 'react-router-dom'
import CallToAction from '../components/landing/CallToAction.tsx'
import Hero from '../components/landing/Hero.tsx'
import OpenSourceSection from '../components/landing/OpenSource.tsx'
import ProductivitySection from '../components/landing/Productivity.tsx'
import Services from '../components/landing/Services.tsx'
import { useSeo } from '../components/shared/SEO.ts'

const Index = () => {
  useSeo(useLocation().pathname, {
    title: 'Ghostify | Home'
  })
  return (
    <main>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-gradient absolute left-0 top-0 h-96 w-96 rounded-full bg-yellow-300 opacity-10 mix-blend-multiply blur-3xl filter"></div>
        <div className="animate-gradient absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
        <div className="animate-gradient absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      </div>
      <Hero />
      <Services />
      <CallToAction />
      <ProductivitySection />
      <OpenSourceSection />
    </main>
  )
}

export default Index
