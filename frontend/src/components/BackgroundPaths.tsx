import { motion } from "framer-motion";

export const FloatingPaths = ({ position }: { position: number }) => {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${280 - i * 4 * position} -${149 + i * 5}C-${280 - i * 4 * position} -${149 + i * 5} -${
      242 - i * 4 * position
    } ${176 - i * 5} ${122 - i * 4 * position} ${283 - i * 5}C${486 - i * 4 * position} ${390 - i * 5} ${
      544 - i * 4 * position
    } ${715 - i * 5} ${544 - i * 4 * position} ${715 - i * 5}`,
    width: 0.4 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 556 296"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const BackgroundPaths = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
};
