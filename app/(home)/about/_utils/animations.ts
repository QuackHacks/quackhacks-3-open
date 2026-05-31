export const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeOut, delay },
    }),
};

export const viewportOpts = { once: true, margin: "-80px 0px" as const };
