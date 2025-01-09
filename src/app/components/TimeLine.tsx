'use client'
import '../globals.css'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import Image from 'next/image'

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
}

const TimelineElementContent = ({ item }: { item: TimelineItem }) => (
  <article className="text-center p-8 rounded-xl bg-background">
    <header className="mb-4">
      <h2 className='text-2xl uppercase tracking-wider font-extrabold' style={{ color: 'var(--theme)' }}>
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
          unoptimized
        />
      </div>
    )}
  </article>
)

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <VerticalTimeline>
      {items.map((item, index) => (
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
  )
}