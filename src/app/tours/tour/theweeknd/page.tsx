"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import "react-vertical-timeline-component/style.min.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
}

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsIntroVisible(true);
    const timer = setTimeout(() => setIsIntroVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  const items: TimelineItem[] = [
    {
      date: "March 21, 2011",
      title: "House of Balloons Released",
      description:
        'The debut mixtape "House of Balloons" marked The Weeknd\'s arrival as a groundbreaking artist in the music world. Combining haunting lyrics with a mix of R&B, indie, and electronic influences, this mixtape paints a vivid picture of escapism, heartbreak, and hedonism. Tracks like "Wicked Games" and "The Morning" encapsulate the themes of lust and despair, reflecting the duality of pleasure and pain. The mixtape not only redefined the sound of contemporary R&B but also solidified The Weeknd\'s reputation as a mysterious, genre-defying artist. The innovative production, paired with his falsetto vocals, created a unique sonic experience that resonated deeply with listeners and influenced a generation of musicians.',
      image: {
        src: "https://lastfm.freetls.fastly.net/i/u/500x500/420479ebfa2c11e0c9310d2183854446.jpg",
        alt: "House of Balloons cover art",
      },
    },
    {
      date: "Song Highlight",
      title: "High for This",
      description:
        'Opening "House of Balloons," "High for This" invites listeners into a shadowy, intoxicating world. The song\'s eerie production and seductive lyrics act as a gateway to the themes explored throughout the mixtape. It captures the essence of surrendering to temptation and the exhilaration of living on the edge. The track\'s slow build and atmospheric soundscape create an immersive experience, making it one of the most iconic opening tracks in modern music. This song sets the tone for the journey that unfolds in the rest of the mixtape, establishing a sense of intrigue and emotional depth.',
      image: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/f94fbb3fce6c42858cdadcc8c7e53139.jpg#f94fbb3fce6c42858cdadcc8c7e53139",
        alt: "High for This visual",
      },
    },
    {
      date: "August 18, 2011",
      title: "Thursday Released",
      description:
        '"Thursday," the second mixtape in The Weeknd\'s trilogy, delves deeper into the intricacies of love, addiction, and fleeting connections. This project showcases The Weeknd\'s ability to weave compelling narratives through his lyrics, offering a raw and unfiltered look at emotional vulnerability. Tracks like "The Birds Pt. 1" and "The Zone" highlight his storytelling prowess, capturing moments of passion, betrayal, and self-awareness. The mixtape also features collaborations with Drake, adding an additional layer of depth and mainstream appeal. With its experimental production and deeply personal themes, "Thursday" cemented The Weeknd\'s status as a trailblazing artist who wasn\'t afraid to push boundaries.',
      image: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/4ec1d552fe9854b32323112004c753fc.jpg#4ec1d552fe9854b32323112004c753fc",
        alt: "Thursday cover art",
      },
    },
    {
      date: "Song Highlight",
      title: "The Zone (feat. Drake)",
      description:
        '"The Zone" stands out as one of the most memorable tracks from "Thursday," featuring a captivating collaboration with Drake. The song explores themes of emotional detachment, intimacy, and the complexity of human relationships. The Weeknd\'s haunting vocals are complemented by Drake\'s introspective verse, creating a perfect synergy between the two artists. The ethereal production, with its minimalistic beats and atmospheric tones, amplifies the song\'s reflective mood. "The Zone" serves as a centerpiece of the mixtape, encapsulating the feelings of isolation and yearning that permeate the project. It\'s a track that continues to resonate with listeners, showcasing The Weeknd\'s knack for creating emotionally charged music.',
    },
    {
      date: "December 21, 2011",
      title: "Echoes of Silence Released",
      description:
        '"Echoes of Silence" concludes The Weeknd\'s trilogy with a mix of raw emotion and experimental soundscapes. This mixtape represents a culmination of the themes explored in "House of Balloons" and "Thursday," offering a darker, more introspective perspective. Tracks like "D.D." (a cover of Michael Jackson\'s "Dirty Diana") and "Montreal" showcase The Weeknd\'s vocal versatility and willingness to take creative risks. The mixtape\'s production is both haunting and innovative, blending elements of R&B, rock, and electronic music. "Echoes of Silence" is a fitting end to the trilogy, providing listeners with a sense of closure while leaving a lasting impression of The Weeknd\'s artistry and vision.',
      image: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/30fca5d3e4678724c93bc977600c13bc.jpg#30fca5d3e4678724c93bc977600c13bc",
        alt: "Echoes of Silence cover art",
      },
    },
    {
      date: "Song Highlight",
      title: "Montreal",
      description:
        '"Montreal" is a standout track on "Echoes of Silence," blending French lyrics with The Weeknd\'s signature style. The song explores themes of longing, regret, and cultural identity, creating a rich and layered listening experience. The melancholic production, paired with The Weeknd\'s emotive delivery, draws listeners into a world of introspection and vulnerability. "Montreal" is a testament to The Weeknd\'s ability to connect with audiences on a deeply personal level while experimenting with different sounds and languages. It serves as a poignant moment in the mixtape, highlighting the artist\'s growth and evolution throughout the trilogy.',
      image: {
        src: "https://lastfm.freetls.fastly.net/i/u/770x0/20d1cbae0c4af43d97abaf7aa31fe845.jpg#20d1cbae0c4af43d97abaf7aa31fe845",
        alt: "Montreal visual",
      },
    },
  ];

  return (
    <>
      {isIntroVisible ? (
        <StaticIntro />
      ) : (
        <>
          <Nav />
          <main className="container mx-auto px-4 py-8 max-w-[1200px]">
            <header className="text-center py-12 mb-8">
              <h1 className="text-xl font-extrabold uppercase tracking-wider leading-tight bg-gradient-to-r from-theme to-foreground-dark bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(var(--theme-rgb),0.2)] animate-fade-in">
                Three Nights, One Story: The Trilogy Experience
              </h1>
            </header>
            {mounted && (
              <VerticalTimeline>
                {items.map((item: TimelineItem, index: number) => (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element"
                    date={item.date}
                    iconStyle={{ background: "var(--theme)", color: "#fff" }}
                  >
                    <TimelineElementContent item={item} />
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            )}
            <section className="mt-12 text-center p-8 bg-theme/5 rounded-xl">
              <h2 className="text-2xl text-theme uppercase tracking-wider mb-4">
                A Deeper Exploration
              </h2>
              <p className="text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Reflect on the complexities, inspirations, and cultural impact
                that shaped these tapes. Each track offers a new layer of
                insight.
              </p>
            </section>
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

const StaticIntro = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 cinematicIntro p-4">
    <h1 className="text-4xl md:text-5xl lg:text-6xl text-center text-theme font-extrabold w-full h-full flex items-center justify-center">
      The Trilogy Immersion
    </h1>
    <p className="text-base md:text-lg lg:text-xl text-foreground/80 text-center max-w-xs md:max-w-lg">
      Embark on a deep dive into The Weeknd&apos;s visionary mixtapes.
    </p>
  </div>
);

const TimelineElementContent = ({ item }: { item: TimelineItem }) => (
  <article className="text-center bg-background p-8 rounded-xl shadow-lg">
    <header className="mb-4">
      <h2 className="text-foreground/90 text-3xl font-bold mb-2 text-theme">
        {item.title}
      </h2>
    </header>
    <p className="text-foreground/90 leading-relaxed text-lg mt-4 mb-6 mx-auto max-w-3xl">
      {item.description}
    </p>
    {item.image && (
      <div className="relative overflow-hidden rounded-lg mt-4">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          width={500}
          height={500}
          className="rounded-lg w-full h-auto"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          unoptimized
        />
      </div>
    )}
  </article>
);

export default Page;
