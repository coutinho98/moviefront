import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

type SVGProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

const Beam: React.FC<SVGProps> = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[100vh] w-[100vw] absolute inset-0 z-0", className)}
      {...props}
    >
      <motion.path
        fill="none"
        strokeWidth="1"
        strokeLinecap="round"
        d="M1 8h14"
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </svg>
  );
};

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [beams, setBeams] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const beamsArray = Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={`beam-${i}`}
        className={cn(
          "absolute top-0 left-0 w-full h-full",
          "transform rotate-[0deg] opacity-20",
          className
        )}
        style={{
          transformOrigin: "center center",
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
        animate={{
          opacity: [0.1, 0.4, 0.1],
          transition: {
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 2,
          },
        }}
      >
        <Beam className="w-full h-full" />
      </motion.div>
    ));
    setBeams(beamsArray);
  }, [className]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full absolute inset-0",
        "overflow-hidden flex items-center justify-center",
        className
      )}
    >
      {beams}
    </div>
  );
};