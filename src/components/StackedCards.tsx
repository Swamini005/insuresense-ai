import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects } from "@/data/projects";

const StackedCards: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);

  // Global scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={container} className="relative" role="region" aria-label="How It Works - Feature Overview">
      {projects.map((project, i) => {
        const targetScale = 1 - (projects.length - i) * 0.05;
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
            range={[i * 0.25, 1]}
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
  progress: any;
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

  // Per-card scroll progress for image scaling
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: i === 0 ? "-25%" : `calc(-25% + ${i * 25}px)`,
        }}
        className="relative flex flex-col w-full max-w-4xl h-[500px] rounded-3xl p-12 shadow-2xl origin-top"
      >
        <h2 className="text-center text-2xl md:text-3xl font-bold text-white m-0 mb-12">
          {title}
        </h2>

        <div className="flex gap-12 h-full mt-12">
          <div className="w-2/5 relative top-[10%]">
            <p className="text-white/90 text-base leading-relaxed mb-4">
              {description}
            </p>
            <span className="flex items-center gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline cursor-pointer text-white hover:text-white/80 transition-colors"
              >
                See more
              </a>
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>

          <div className="w-3/5 relative h-full rounded-3xl overflow-hidden">
            <motion.div
              className="w-full h-full"
              style={{ scale: imageScale }}
            >
              <img
                src={src}
                alt={`${title} - InsureSense feature demonstration`}
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
