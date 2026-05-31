"use client";

import { motion } from "motion/react";
import { fadeUp, viewportOpts } from "../_utils/animations";

interface SectionHeaderProps {
    badge?: string;
    heading: string;
    subtitle?: string;
    subtitleColor?: string;
    mdItemsAlign?: "start" | "end";
    gap?: string;
    animDelay?: number;
    children?: React.ReactNode;
}

const SectionHeader = ({
    badge,
    heading,
    subtitle,
    subtitleColor = "text-neutral-500",
    mdItemsAlign = "start",
    gap = "gap-4",
    animDelay = 0,
    children,
}: SectionHeaderProps) => {
    const hasChildren = !!children;

    return (
        <motion.div
            className={`mb-8 ${hasChildren ? `flex flex-col md:flex-row md:items-${mdItemsAlign} md:justify-between ${gap}` : ""}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
            custom={animDelay}
        >
            <div>
                {badge ? (
                    <div className="text-xs tracking-widest text-brand-500 mb-3">[ {badge} ]</div>
                ) : null}
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    {heading}
                </h2>
                {subtitle && (
                    <p className={`text-sm ${subtitleColor} mt-2`}>{subtitle}</p>
                )}
            </div>
            {children}
        </motion.div>
    );
};

export default SectionHeader;
