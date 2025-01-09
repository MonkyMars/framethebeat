import '../globals.css'

const Discover = () => {
  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg">
      <h2 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Discover
      </h2>
      <p className="text-[clamp(1rem,5vw,1.35rem)] font-normal leading-relaxed text-[rgba(var(--foreground-rgb),0.9)] shadow-text">
        Frame The Beat is a open source platform for album cover art. Search here for your favorite album covers and saved them.
      </p>
    </section>
  )
}

export default Discover;