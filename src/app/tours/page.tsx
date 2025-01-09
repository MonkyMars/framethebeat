import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const Tours = () => {
  const AvailableTours = [
    {
      title: "Three Nights, One Story: The Trilogy Experience",
      artist: "The Weeknd",
      cover: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/8df0660e16d36d03026e1fa132fc509d.jpg#8df0660e16d36d03026e1fa132fc509d",
        alt: "Trilogy album cover",
      },
      desciption:
        "Wander through The Weeknd's iconic trilogy with this immersive journey into his first three albums.",
    },
  ];

  return (
    <>
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Available Tours</h1>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {AvailableTours.map((tour, index) => (
            <article
              key={`tour-${tour.title}-${index}`}
              className="backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] p-8 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-[300px] overflow-hidden rounded-xl">
                <Image
                  src={tour.cover.src}
                  alt={tour.cover.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL={tour.cover.src}
                  className="hover:scale-105 transition-all duration-300"
                  unoptimized
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-foreground">
                  {tour.title}
                </h2>
                <span className="text-[rgba(var(--theme-rgb),0.7)] md:text-base font-semibold">
                  {tour.artist}
                </span>
                <p className="text-[rgba(var(--foreground-rgb),0.9)] line-clamp-3">
                  {tour.desciption}
                </p>
                <div className="flex justify-center">
                <Link
                  href={`/tours/tour/${tour.artist
                    .toLowerCase()
                    .trim()
                    .replace(" ", "")}`}
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-br from-[var(--theme)] to-[rgba(var(--theme-rgb),0.8)] text-foreground text-base font-semibold border border-[rgba(255,255,255,0.1)] shadow-[0_4px_15px_rgba(var(--theme-rgb),0.2),inset_0_1px_2px_rgba(255,255,255,0.2)] backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(var(--theme-rgb),0.3),inset_0_1px_3px_rgba(255,255,255,0.3)] active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(var(--theme-rgb),0.2)] text-center"
                >
                  Start Tour
                </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Tours;
