import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";

const StackedCards: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);

  // Scroll progress across the whole stacked section.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={container} className="relative" role="region" aria-label="How It Works - Feature Overview">
      {projects.map((project, i) => {
        // Earlier cards shrink slightly as later ones stack on top.
        const targetScale = 1 - (projects.length - i) * 0.04;
        return (
          <Card
            key={`p_${i}`}
            i={i}
            title={project.title}
            description={project.description}
            src={project.src}
            link={project.link}
            color={project.color}
            progress={scrollYProgress}
            range={[i * (1 / projects.length), 1]}
            targetScale={targetScale}
          />
        );
      })}
    </main>
  );
};

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  link: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  src,
  link,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef<HTMLDivElement | null>(null);

  // Per-card progress used to zoom the image as the card enters.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.6, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 28}px)`,
        }}
        className="relative flex flex-col w-full max-w-5xl h-[460px] md:h-[480px] rounded-[28px] p-8 md:p-12 shadow-2xl origin-top overflow-hidden text-white"
      >
        {/* Solid brand color with a subtle depth gradient on top */}
        <div className="absolute inset-0" style={{ backgroundColor: color }} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15" />

        <div className="relative flex items-center gap-3 mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold backdrop-blur-sm">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            How it works
          </span>
        </div>

        <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 flex-1 min-h-0">
          {/* Text */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
              {title}
            </h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6">
              {description}
            </p>
            <a
              href={link}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all w-fit"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Image */}
          <div className="relative h-48 md:h-full rounded-2xl overflow-hidden ring-1 ring-white/20">
            <motion.div className="w-full h-full" style={{ scale: imageScale }}>
              <img
                src={src}
                alt={`${title} - InsureSense feature`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StackedCards;
