import '../globals.css'

const Discover = () => {
  return (
    <section className="section" aria-labelledby="discover-heading">
      <h2 id="discover-heading" className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Discover
      </h2>
      <p className="text-[clamp(1rem,5vw,1.35rem)] font-normal leading-relaxed text-[rgba(var(--foreground-rgb),0.9)] shadow-text">
        Frame The Beat is an open source platform for album cover art. Search here for your favorite album covers and save them.
      </p>
    </section>
  )
}

export default Discover;