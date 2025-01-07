import React from "react";

interface BannerProps {
    title: string;
    subtitle: string;
}

const Banner: React.FC<BannerProps> = ({title, subtitle}) => {
    return(
        <section className="fixed bottom-0 left-0 min-w-screen max-w-screen p-4 bg-background/95 backdrop-blur-lg border-t border-theme/10 flex justify-center items-center gap-4 z-50 transition-transform duration-300 shadow-md flex-col">
            <h3 className="text-[clamp(1rem,3vw,1.6rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground shadow-white">{title}</h3>
            <p className="text-center text-[clamp(0.9rem,2.5vw,1.2rem)] text-foreground/90 leading-relaxed my-2 shadow-sm max-w-[800px]">{subtitle}</p>
        </section>
    )
}

export default Banner;