"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useMotionValue, animate } from "motion/react";

import Img04 from "../../../../public/photos/moments-19.jpg";
import Img05 from "../../../../public/photos/moments-17.jpg";
import Img06 from "../../../../public/photos/moments-06.jpg";
import Img07 from "../../../../public/photos/moments-07.jpg";
import Img08 from "../../../../public/photos/moments-08.jpg";
import Img09 from "../../../../public/photos/moments-18.jpg";

import { fadeUp, viewportOpts } from "../_utils/animations";
import SectionHeader from "../_components/SectionHeader";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

/* ── data ──────────────────────────────────────────────────── */
type PastEvent = {
    title: string;
    date: string;
    description: string;
    image: StaticImageData;
};

const pastEvents: PastEvent[] = [
    {
        title: "QuackHacks 1.0",
        date: "Winter 2025",
        description:
            "Our inaugural hackathon brought together + students for 24 hours of hacking, workshops, and fun.",
        image: Img04,
    },
    {
        title: "QuackHacks Lite",
        date: "Spring 2025",
        description:
            "QH Lite brought together local Eugene High Schoolers to participate in a mini-hackathon.",
        image: Img05,
    },
    {
        title: "QuackHacks 2.0",
        date: "Fall 2025",
        description:
            "Our biggest event yet, 200+ participants, industry sponors, and $5k in prizes.",
        image: Img06,
    },
    {
        title: "QuackHacks 2.0",
        date: "Fall 2025",
        description:
            "Students pitching their projects to judges.",
        image: Img07,
    },
    {
        title: "QuackHacks 2.0",
        date: "Fall 2025",
        description:
            "A quick nap break to keep our team refreshed.",
        image: Img08,
    },
    {
        title: "QuackHacks 2.0",
        date: "Fall 2025",
        description:
            "We provide our hackers with the best food in the game with our five catered meals.",
        image: Img09,
    },
];

/* ── card dimensions ───────────────────────────────────────── */
const CARD_W = 340;
const CARD_H = 340;
const GAP = 24;
const STEP = CARD_W + GAP;
const N = pastEvents.length;
const TOTAL_W = N * CARD_W + (N - 1) * GAP;

/* ── component ─────────────────────────────────────────────── */
const PastEvents = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [currentIdx, setCurrentIdx] = useState(0);
    // minX = how far left we can scroll before empty space appears on the right
    const [minX, setMinX] = useState(-(TOTAL_W));
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);

    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;
            const cw = containerRef.current.offsetWidth;
            setMinX(Math.min(0, -(TOTAL_W - cw)));
        };
        update();
        const ro = new ResizeObserver(update);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // last index reachable without showing empty space
    const maxIdx = Math.max(0, Math.ceil(-minX / STEP));

    // update edge fades whenever currentIdx or maxIdx changes
    useEffect(() => {
        setShowLeftFade(currentIdx > 0);
        setShowRightFade(currentIdx < maxIdx);
    }, [currentIdx, maxIdx]);

    const goTo = useCallback(
        (idx: number) => {
            const target = Math.max(0, Math.min(maxIdx, idx));
            const targetX = Math.max(minX, -(target * STEP));
            setCurrentIdx(target);
            animate(x, targetX, { type: "spring", stiffness: 300, damping: 35 });
        },
        [x, minX, maxIdx],
    );

    const prev = () => goTo(currentIdx - 1);
    const next = () => goTo(currentIdx + 1);

    const handleDragEnd = useCallback(
        (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
            let target: number;
            if (Math.abs(info.velocity.x) > 300 || Math.abs(info.offset.x) > 50) {
                target = info.offset.x > 0 ? currentIdx - 1 : currentIdx + 1;
            } else {
                target = Math.round(-x.get() / STEP);
            }
            goTo(target); // no wrap on drag
        },
        [x, currentIdx, goTo],
    );

    return (
        <section className="w-full px-4 md:px-8 py-6 md:py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* ── Heading ── */}
                <SectionHeader
                    badge="0x02"
                    heading="PAST EVENTS"
                    subtitle="Some of the many highlights from our previous events!"
                    mdItemsAlign="end"
                >
                    <div className="flex gap-3">
                        <button
                            onClick={prev}
                            disabled={currentIdx === 0}
                            className={`w-10 h-10 border flex items-center justify-center transition-colors
								${currentIdx === 0
									? "border-neutral-800 text-neutral-700 cursor-not-allowed opacity-40"
									: "border-neutral-700 text-neutral-400 hover:text-white hover:bg-brand-500 hover:border-brand-500 cursor-pointer"
								}`}
                            aria-label="Previous event"
                        >
                            <ArrowLeftIcon color={currentIdx === 0 ? "gray" : "black"}/>
                        </button>
                        <button
                            onClick={next}
                            disabled={currentIdx === maxIdx}
                            className={`w-10 h-10 border flex items-center justify-center transition-colors
								${currentIdx === maxIdx
									? "border-neutral-800 text-neutral-700 cursor-not-allowed opacity-40"
									: "border-neutral-700 text-neutral-400 hover:text-white hover:bg-brand-500 hover:border-brand-500 cursor-pointer"
								}`}
                            aria-label="Next event"
                        >
                            <ArrowRightIcon color={currentIdx === maxIdx ? "gray" : "black"}/>
                        </button>
                    </div>
                </SectionHeader>

                {/* ── Carousel track ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOpts}
                    custom={0.15}
                >
                    <div ref={containerRef} className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                        {/* Left fade — more content to scroll back */}
                        <div
                            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-linear-to-r from-neutral-950 to-transparent transition-opacity duration-300"
                            style={{ opacity: showLeftFade ? 1 : 0 }}
                        />
                        {/* Right fade — more content ahead */}
                        <div
                            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-linear-to-l from-neutral-950 to-transparent transition-opacity duration-300"
                            style={{ opacity: showRightFade ? 1 : 0 }}
                        />

                        <motion.div
                            className="flex"
                            style={{ x, gap: GAP }}
                            drag="x"
                            dragConstraints={{ left: minX, right: 0 }}
                            dragElastic={0}
                            onDragEnd={handleDragEnd}
                        >
                            {pastEvents.map((event, i) => (
                                <div
                                    key={i}
                                    className="shrink-0 group"
                                    style={{ width: CARD_W, height: CARD_H }}
                                >
                                    <div className="flex flex-col h-full border border-neutral-800 bg-neutral-950 overflow-hidden
										transition-all duration-300 group-hover:border-brand-500/60">
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent" />
                                            <div className="absolute top-3 left-3 bg-brand-500/90 text-white text-[10px] font-bold tracking-wider px-2 py-1">
                                                {event.date}
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 p-5">
                                            <h3 className="text-lg font-bold mb-2 text-neutral-300 group-hover:text-brand-500 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-xs text-neutral-400 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── Dot indicators ── */}
                <motion.div
                    className="flex justify-center gap-2 mt-8"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOpts}
                    custom={0.3}
                >
                    {Array.from({ length: maxIdx + 1 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                i === currentIdx
                                    ? "w-8 bg-brand-500"
                                    : "w-3 bg-neutral-700 hover:bg-neutral-500"
                            }`}
                            aria-label={`Go to position ${i + 1}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default PastEvents;
