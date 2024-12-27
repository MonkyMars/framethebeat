"use client"
import React from "react";
import "./styles.scss";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Tours = () => {
  const router = useRouter();
  const [state] = React.useState<boolean>(true);

  if (!state) {
    return <div className="comingsoon">
      <h1>Coming Soon</h1>
    </div>;
  }

  const AvailableTours = [
    {
      title: "Three Nights, One Story: The Trilogy Experience",
      artist: "The Weeknd",
      cover: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/8df0660e16d36d03026e1fa132fc509d.jpg#8df0660e16d36d03026e1fa132fc509d",
        alt: "Trilogy album cover",
      },
      desciption: "Wander through The Weeknd's iconic trilogy with this immersive journey into his first three albums.",
    },
  ]

  return (
    <>
      <Nav/>
      <main>
        <header>
          <h1>Available Tours</h1>
        </header>
        <section>
            {AvailableTours.map((tour, index) => (
            <article key={`tour-${tour.title}-${index}`} className="tourCard">
              <div className="tourCard__image">
              <Image 
                src={tour.cover.src} 
                alt={tour.cover.alt} 
                width={1500} 
                height={1500}
                placeholder="blur"
                blurDataURL={tour.cover.src}
                className="tourCard__cover"
              />
              </div>
              <div className="tourCard__content">
              <h2 className="tourCard__title">{tour.title}</h2>
              <span className="tourCard__artist">{tour.artist}</span>
              <p className="tourCard__description">{tour.desciption}</p>
              <button className="tourCard__button" onClick={() => router.push(`/tours/tour/${tour.artist.toLowerCase().trim().replace(' ', '')}`)}>Start Tour</button>
              </div>
            </article>
            ))}
        </section>
      </main>
      <Footer/>
    </>
  );
}


export default Tours;