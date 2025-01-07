const StartCollection = () => {
  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg">
      <h2 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        For Music Enthusiasts
      </h2>
      <ul className="flex flex-wrap gap-4 justify-center max-w-full h-auto transition-all duration-300">
        <li className="list-none cursor-pointer uppercase">
          <span className="px-4 py-2 rounded bg-[rgba(var(--theme-rgb),0.2)] border border-[rgba(var(--theme-rgb),0.3)] transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.3)] hover:border-[rgba(var(--theme-rgb),0.4)]">
            Create your own collection of favorites
          </span>
        </li>
        <li className="list-none cursor-pointer uppercase">
          <span className="px-4 py-2 rounded bg-[rgba(var(--theme-rgb),0.2)] border border-[rgba(var(--theme-rgb),0.3)] transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.3)] hover:border-[rgba(var(--theme-rgb),0.4)]">
            Save album covers for quick access
          </span>
        </li>
        <li className="list-none cursor-pointer uppercase">
          <span className="px-4 py-2 rounded bg-[rgba(var(--theme-rgb),0.2)] border border-[rgba(var(--theme-rgb),0.3)] transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.3)] hover:border-[rgba(var(--theme-rgb),0.4)]">
            Contribute album art to the community
          </span>
        </li>
      </ul>
    </section>
  )
}

export default StartCollection;