import Link from 'next/link';
import '../globals.css'
import { ArrowRight } from 'lucide-react';

const Discover = () => {
  return (
    <section className="section" aria-labelledby="discover-heading">
      <h2 id="discover-heading" className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Discover
      </h2>
      <p className="text-[clamp(1rem,5vw,1.35rem)] font-normal leading-relaxed text-[rgba(var(--foreground-rgb),0.9)] shadow-text">
        Frame The Beat is an open source platform for album cover art. Search here for your favorite album covers and save them.
      </p>
      <Link 
        href="/collection" 
        className="flex items-center justify-center gap-2 mt-4 px-5 py-2 text-xl font-medium text-theme hover:text-theme-dark transition-colors duration-300 group"
      >
        <span>Explore our collection</span>
        <ArrowRight 
          size={22} 
          className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out" 
        />
      </Link>
    </section>
  )
}

export default Discover;