"use client";

import { useState } from "react";
import { motion } from "motion/react";

const NEON = "#B6FF00";

const features = [
  {
    title: "Live System Telemetry",
    description: "Monitor builds, metrics, and events in real time during the hackathon."
  },
  {
    title: "AI-Assisted Development",
    description: "Accelerate debugging, prototyping, and decision-making with AI support."
  },
  {
    title: "Historical Project Insights",
    description: "Review past submissions and patterns to optimize your strategy."
  }
];

export default function FeaturePanelStatic() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="space-y-6 w-full">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4 + i * 0.15,
            type: "spring",
            stiffness: 100,
          }}
          onMouseEnter={() => setHoveredFeature(i)}
          onMouseLeave={() => setHoveredFeature(null)}
          className="group relative"
        >
          {/* Neon glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(182,255,0,0.25), transparent 65%)",
            }}
            animate={{
              opacity: hoveredFeature === i ? 1 : 0,
            }}
            transition={{ duration: 0.25 }}
          />

          {/* Card */}
          <motion.div
            className="
              relative
              p-6
              rounded-2xl
              border
              border-white/10
              bg-black/40
              backdrop-blur-sm
            "
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(182,255,0,0.45)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-4">
              {/* Optional icon slot (kept empty on purpose for minimalism) */}
              <motion.div
                className="w-2 h-2 mt-2 rounded-full"
                style={{ backgroundColor: NEON }}
                animate={{
                  scale: hoveredFeature === i ? [1, 1.4, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: hoveredFeature === i ? Infinity : 0,
                }}
              />

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold tracking-wide text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-white/65 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
