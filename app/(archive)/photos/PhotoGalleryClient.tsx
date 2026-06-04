"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DownloadIcon, ExternalLinkIcon, ImageIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import type { GalleryPhoto } from "./types";

type Props = {
  photos: GalleryPhoto[];
};

const kPhotosPerPage = 24;
const kModalZIndex = 1000;
const kPhotoHoverStackMin = 20;
const kPhotoHoverStackMax = 60;
let photoHoverStack = 20;
const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const viewportOpts = { once: true, margin: "-80px 0px" as const };
type PhotoFrame = Pick<DOMRect, "left" | "top" | "width" | "height">;
type OpeningPhotoTransition = {
  index: number;
  from: PhotoFrame;
  to: PhotoFrame;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay },
  }),
};

const photoCardVariants = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.96,
    filter: "grayscale(1) blur(6px)",
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "grayscale(0) blur(0px)",
    transition: {
      duration: 0.7,
      delay: (index % 12) * 0.04,
      ease: easeOut,
    },
  }),
};

function formatTitle(title: string) {
  return title.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function getDownloadHref(photo: GalleryPhoto) {
  const photoUrl = new URL(photo.urls.full);
  const extension = photoUrl.pathname.split(".").pop() ?? "jpg";
  const filename = `${formatTitle(photo.title) || photo.id}.${extension}`;
  const params = new URLSearchParams({
    url: photo.urls.full,
    filename,
  });

  return `/photos/download?${params.toString()}`;
}

function getNextPhotoZIndex() {
  photoHoverStack =
    photoHoverStack >= kPhotoHoverStackMax
      ? kPhotoHoverStackMin + 1
      : photoHoverStack + 1;
  return photoHoverStack;
}

function getCenteredPhotoFrame(photo: GalleryPhoto): PhotoFrame {
  if (typeof window === "undefined") {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  const aspectRatio = photo.width / photo.height;
  const horizontalChrome = window.innerWidth >= 768 ? 152 : 108;
  const maxWidth = Math.max(160, window.innerWidth - horizontalChrome);
  const contentTop = 56;
  const maxHeight = Math.max(160, window.innerHeight - contentTop - 32);

  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    left: (window.innerWidth - width) / 2,
    top: contentTop + (window.innerHeight - contentTop - height) / 2,
    width,
    height,
  };
}

export function PhotoGalleryClient({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openingTransition, setOpeningTransition] =
    useState<OpeningPhotoTransition | null>(null);
  const [settledFrame, setSettledFrame] = useState<PhotoFrame | null>(null);
  const [isPhotoSettled, setIsPhotoSettled] = useState(false);
  const [isFullPhotoLoaded, setIsFullPhotoLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(kPhotosPerPage);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const visiblePhotos = useMemo(
    () => photos.slice(0, visibleCount),
    [photos, visibleCount],
  );
  const hasMorePhotos = visibleCount < photos.length;

  const activePhoto =
    activeIndex === null ? null : (photos[activeIndex] ?? null);
  const activePosition = activeIndex ?? 0;
  const activeTransition =
    activeIndex !== null && openingTransition?.index === activeIndex
      ? openingTransition
      : null;
  const activeFrame = activeTransition?.to ?? settledFrame;
  const shouldShowFullPhoto = isPhotoSettled && isFullPhotoLoaded;

  const loadMorePhotos = useCallback(() => {
    setVisibleCount((count) => Math.min(count + kPhotosPerPage, photos.length));
  }, [photos.length]);

  const closePhoto = useCallback(() => {
    setActiveIndex(null);
    setOpeningTransition(null);
    setSettledFrame(null);
    setIsPhotoSettled(false);
    setIsFullPhotoLoaded(false);
  }, []);

  const openPhoto = useCallback(
    (index: number, from: PhotoFrame) => {
      const photo = photos[index];
      if (!photo) return;
      const to = getCenteredPhotoFrame(photo);

      setOpeningTransition({
        index,
        from,
        to,
      });
      setSettledFrame(to);
      setIsPhotoSettled(false);
      setIsFullPhotoLoaded(false);
      setActiveIndex(index);
    },
    [photos],
  );

  const movePhoto = useCallback(
    (nextIndex: number) => {
      const boundedIndex = Math.min(Math.max(nextIndex, 0), photos.length - 1);
      const photo = photos[boundedIndex];
      if (!photo) return;

      setOpeningTransition(null);
      setSettledFrame(getCenteredPhotoFrame(photo));
      setIsPhotoSettled(true);
      setIsFullPhotoLoaded(false);
      setActiveIndex(boundedIndex);
    },
    [photos],
  );

  useEffect(() => {
    if (!activePhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePhoto();
      if (event.key === "ArrowLeft") {
        movePhoto(Math.max(activePosition - 1, 0));
      }
      if (event.key === "ArrowRight") {
        movePhoto(Math.min(activePosition + 1, photos.length - 1));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activePhoto, activePosition, closePhoto, movePhoto, photos.length]);

  useEffect(() => {
    if (!activePhoto) return;

    let isCancelled = false;
    const image = new window.Image();
    const markFullPhotoReady = async () => {
      try {
        await image.decode?.();
      } catch {
        // Some browsers reject decode for cached/cross-origin images after load.
      }
      if (!isCancelled) setIsFullPhotoLoaded(true);
    };
    image.onload = () => {
      void markFullPhotoReady();
    };
    image.onerror = () => {
      if (!isCancelled) setIsFullPhotoLoaded(true);
    };
    image.src = activePhoto.urls.full;

    return () => {
      isCancelled = true;
    };
  }, [activePhoto]);

  useEffect(() => {
    closePhoto();
    setVisibleCount(kPhotosPerPage);
  }, [closePhoto, photos]);

  useEffect(() => {
    if (!hasMorePhotos) return;
    if (typeof IntersectionObserver === "undefined") return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        loadMorePhotos();
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [photos.length, hasMorePhotos, loadMorePhotos, visibleCount]);

  if (!photos.length) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center border border-neutral-950/15 bg-white/80 p-10 text-center">
        <ImageIcon className="h-8 w-8 text-brand-700" />
        <h2 className="mt-4 font-liebling text-3xl font-bold text-neutral-950">
          No photos yet
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
          The manifest loaded, but it does not contain any photos.
        </p>
      </div>
    );
  }

  return (
    <>
      {photos.length > 0 ? (
        <motion.div
          className="mb-4 font-mono text-[10px] uppercase tracking-superwide text-neutral-500"
          aria-live="polite"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOpts}
          custom={0}
        >
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onOpen={(from) => openPhoto(index, from)}
          />
        ))}
      </div>

      {hasMorePhotos ? (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          <motion.button
            type="button"
            onClick={loadMorePhotos}
            className="border border-neutral-950/15 bg-white/85 px-5 py-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-700 transition-colors hover:border-brand-700 hover:bg-brand-700 hover:text-white"
            whileTap={{ scale: 0.96 }}
          >
            Load more photos
          </motion.button>
        </div>
      ) : null}

      {activePhoto ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex flex-col bg-neutral-950/95 text-white"
          style={{ zIndex: kModalZIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: easeOut }}
        >
          <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-superwide text-white/45">
                {activePosition + 1} / {photos.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getDownloadHref(activePhoto)}
                download
                className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Download photo"
              >
                <DownloadIcon className="h-4 w-4" />
              </a>
              <a
                href={activePhoto.urls.full}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Open full photo"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={closePhoto}
                className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-4 md:gap-4 md:px-5">
            <button
              type="button"
              onClick={() => movePhoto(activePosition - 1)}
              disabled={activePosition === 0}
              className="h-12 w-10 border border-white/15 bg-white/10 font-mono text-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 md:w-12"
              aria-label="Previous photo"
            >
              &lt;
            </button>
            <div className="relative flex h-full min-h-0 items-center justify-center">
              {activeFrame ? (
                <motion.div
                  key={`opening-frame-${activePhoto.id}`}
                  className="pointer-events-none fixed overflow-hidden bg-neutral-200 shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
                  style={{
                    left: activeTransition?.from.left ?? activeFrame.left,
                    top: activeTransition?.from.top ?? activeFrame.top,
                    width: activeTransition?.from.width ?? activeFrame.width,
                    height: activeTransition?.from.height ?? activeFrame.height,
                    zIndex: kModalZIndex + 2,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    width: activeTransition?.from.width ?? activeFrame.width,
                    height: activeTransition?.from.height ?? activeFrame.height,
                    opacity: 1,
                  }}
                  animate={{
                    x: activeTransition
                      ? activeTransition.to.left - activeTransition.from.left
                      : 0,
                    y: activeTransition
                      ? activeTransition.to.top - activeTransition.from.top
                      : 0,
                    width: activeFrame.width,
                    height: activeFrame.height,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.36, ease: easeOut }}
                  onAnimationComplete={() => setIsPhotoSettled(true)}
                >
                  <motion.img
                    src={activePhoto.urls.thumb1200}
                    alt={formatTitle(activePhoto.title)}
                    className="absolute inset-0 h-full w-full object-cover"
                    animate={{ opacity: shouldShowFullPhoto ? 0 : 1 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                  />
                  <motion.img
                    src={activePhoto.urls.full}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: shouldShowFullPhoto ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                  />
                </motion.div>
              ) : null}
              {!activeFrame ? (
                <motion.img
                  key={`thumb-${activePhoto.id}`}
                  src={activePhoto.urls.thumb1200}
                  alt={formatTitle(activePhoto.title)}
                  className="mx-auto max-h-full min-h-0 max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: shouldShowFullPhoto ? 0 : 1 }}
                  transition={{ duration: 0.18, ease: easeOut }}
                />
              ) : null}
              {!activeFrame && shouldShowFullPhoto ? (
                <motion.img
                  key={`full-${activePhoto.id}`}
                  src={activePhoto.urls.full}
                  alt={formatTitle(activePhoto.title)}
                  className="absolute mx-auto max-h-full min-h-0 max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.22, ease: easeOut }}
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => movePhoto(activePosition + 1)}
              disabled={activePosition === photos.length - 1}
              className="h-12 w-10 border border-white/15 bg-white/10 font-mono text-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 md:w-12"
              aria-label="Next photo"
            >
              &gt;
            </button>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (from: PhotoFrame) => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [isRaised, setIsRaised] = useState(false);
  const [zIndex, setZIndex] = useState(0);

  return (
    <motion.div
      className="relative aspect-4/3 will-change-transform"
      style={{ zIndex: isRaised ? zIndex : 0 }}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOpts}
      variants={photoCardVariants}
    >
      <motion.button
        type="button"
        onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
        onHoverStart={() => {
          setIsRaised(true);
          setZIndex(getNextPhotoZIndex());
          setIsHovering(true);
        }}
        onHoverEnd={() => setIsHovering(false)}
        onAnimationComplete={() => {
          if (!isHovering) setIsRaised(false);
        }}
        animate={{ scale: isHovering ? 1.1 : 1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="group absolute inset-0 block w-full overflow-hidden bg-neutral-200 text-left will-change-transform"
      >
        <img
          src={photo.urls.thumb1200}
          srcSet={`${photo.urls.thumb480} 480w, ${photo.urls.thumb1200} 1200w`}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={formatTitle(photo.title)}
          loading="lazy"
          width={photo.width}
          height={photo.height}
          className="h-full w-full bg-neutral-200 object-cover transition-transform duration-300 group-hover:scale-[1.015]"
        />
      </motion.button>
    </motion.div>
  );
}
