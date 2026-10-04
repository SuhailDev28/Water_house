import { useEffect, useMemo, useRef, useState } from "react";
import "./ScrollJourney.css";

const STAGES = [
  {
    start: 0,
    end: 0.2,
    eyebrow: "WATER HOUSE",
    title: (
      <>
        WATER,
        <br />
        <em>BUT REIMAGINED.</em>
      </>
    ),
    body: "A new way to experience hydration.",
    align: "left",
  },
  {
    start: 0.2,
    end: 0.4,
    eyebrow: "01 — FLAVOUR",
    title: (
      <>
        ADD
        <br />
        <em>FLAVOUR.</em>
      </>
    ),
    body: "Fresh fruit. Herbs. Natural ingredients.",
    align: "left",
  },
  {
    start: 0.4,
    end: 0.6,
    eyebrow: "02 — FUNCTION",
    title: (
      <>
        ADD WHAT
        <br />
        <em>YOUR BODY NEEDS.</em>
      </>
    ),
    body: "Electrolytes, magnesium, creatine, collagen, caffeine and L-theanine.",
    align: "right",
  },
  {
    start: 0.6,
    end: 0.8,
    eyebrow: "03 — YOUR RITUAL",
    title: (
      <>
        FLAVOUR
        <br />
        <em>+ FUNCTION.</em>
      </>
    ),
    body: "Freshly made. Functional. Personal.",
    align: "left",
  },
  {
    start: 0.8,
    end: 1.0001,
    eyebrow: "WATER HOUSE",
    title: (
      <>
        YOUR WATER.
        <br />
        <em>YOUR WAY.</em>
      </>
    ),
    body: "MODERN HYDRATION RITUAL",
    align: "center",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  );
}

export default function ScrollJourney() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const animationFrameRef = useRef(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const targetTimeRef = useRef(0);
  const smoothTimeRef = useRef(0);

  const lastRenderedProgressRef = useRef(-1);
  const lastSeekTimeRef = useRef(0);
  const primedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const activeStageIndex = useMemo(() => {
    const index = STAGES.findIndex(
      (stage) => progress >= stage.start && progress < stage.end,
    );

    return index === -1 ? STAGES.length - 1 : index;
  }, [progress]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    video.muted = true;
    video.playsInline = true;

    return undefined;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video || !videoReady) return undefined;

    let destroyed = false;

    const ios = isIOSDevice();
    const touch = isTouchDevice();

    const getViewportHeight = () =>
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = getViewportHeight();

      const scrollableDistance = Math.max(
        section.offsetHeight - viewportHeight,
        1,
      );

      return clamp(-rect.top / scrollableDistance);
    };

    const getSafeDuration = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return 0;
      }

      return Math.max(video.duration - 0.06, 0);
    };

    const updateTarget = () => {
      const nextProgress = getScrollProgress();

      targetProgressRef.current = nextProgress;

      const safeDuration = getSafeDuration();

      if (safeDuration > 0) {
        targetTimeRef.current = nextProgress * safeDuration;
      }
    };

    const animate = (timestamp) => {
      if (destroyed) return;

      const progressEase = touch ? 0.11 : 0.14;
      const videoEase = touch ? 0.1 : 0.13;

      smoothProgressRef.current = lerp(
        smoothProgressRef.current,
        targetProgressRef.current,
        progressEase,
      );

      smoothTimeRef.current = lerp(
        smoothTimeRef.current,
        targetTimeRef.current,
        videoEase,
      );

      const smoothProgress = smoothProgressRef.current;
      const smoothTime = smoothTimeRef.current;

      if (Math.abs(smoothProgress - lastRenderedProgressRef.current) > 0.002) {
        lastRenderedProgressRef.current = smoothProgress;
        setProgress(smoothProgress);
      }

      /*
       * iPhone Safari is more sensitive to continuous seeks.
       * We throttle seek frequency and never seek while Safari
       * is already processing another seek.
       */
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.readyState >= 2 &&
        !video.seeking
      ) {
        const difference = Math.abs(video.currentTime - smoothTime);

        const seekThreshold = ios ? 0.05 : 0.02;
        const seekInterval = ios ? 50 : 16;

        if (
          difference > seekThreshold &&
          timestamp - lastSeekTimeRef.current >= seekInterval
        ) {
          try {
            const safeDuration = getSafeDuration();

            video.currentTime = clamp(smoothTime, 0.001, safeDuration);

            lastSeekTimeRef.current = timestamp;
          } catch {
            // Safari may reject a seek while decoding/buffering.
          }
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    /*
     * Start from the correct point immediately if the page
     * loads while already scrolled into this section.
     */
    const initialProgress = getScrollProgress();
    const safeDuration = getSafeDuration();

    targetProgressRef.current = initialProgress;
    smoothProgressRef.current = initialProgress;

    targetTimeRef.current =
      safeDuration > 0 ? initialProgress * safeDuration : 0;

    smoothTimeRef.current = targetTimeRef.current;

    setProgress(initialProgress);

    if (safeDuration > 0 && video.readyState >= 2) {
      try {
        video.currentTime = clamp(smoothTimeRef.current, 0.001, safeDuration);
      } catch {
        // Safe fallback.
      }
    }

    const handleScroll = () => {
      updateTarget();
    };

    const handleResize = () => {
      updateTarget();
    };

    const handleViewportResize = () => {
      updateTarget();
    };

    updateTarget();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    window.visualViewport?.addEventListener("resize", handleViewportResize, {
      passive: true,
    });

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      destroyed = true;

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportResize,
      );

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoReady]);

  const primeVideo = async (video) => {
    if (!video || primedRef.current) return;

    primedRef.current = true;

    video.muted = true;
    video.playsInline = true;

    try {
      /*
       * iOS Safari can show black until it has actually decoded
       * at least one frame. Brief autoplay while muted primes it.
       */
      await video.play();

      window.setTimeout(() => {
        try {
          video.pause();

          if (Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = 0.01;
          }
        } catch {
          // Ignore delayed Safari seek error.
        }

        setVideoReady(true);
      }, 80);
    } catch {
      /*
       * Fallback for browsers that reject play().
       */
      try {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = 0.01;
        }
      } catch {
        // Ignore early seek failure.
      }

      setVideoReady(true);
    }
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="wh-scroll-journey"
      aria-label="Water House hydration journey"
    >
      <div className="wh-scroll-journey__sticky">
        <video
          ref={videoRef}
          className="wh-scroll-journey__video"
          src="/videos/water-house-journey.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;

            video.muted = true;
            video.playsInline = true;

            primeVideo(video);
          }}
          onLoadedData={(event) => {
            const video = event.currentTarget;

            if (!primedRef.current) {
              primeVideo(video);
            }
          }}
          onCanPlay={(event) => {
            const video = event.currentTarget;

            /*
             * Once the first frame is decoded we don't want the
             * video playing independently from scroll.
             */
            if (videoReady && !video.paused) {
              video.pause();
            }
          }}
          onError={(event) => {
            console.error(
              "Water House scroll video failed:",
              event.currentTarget.error,
            );
          }}
        />

        <div className="wh-scroll-journey__shade" />

        <div className="wh-scroll-journey__content">
          {STAGES.map((stage, index) => (
            <article
              key={`${stage.eyebrow}-${index}`}
              className={[
                "wh-scroll-copy",
                `wh-scroll-copy--${stage.align}`,
                index === activeStageIndex ? "is-active" : "",
              ].join(" ")}
              aria-hidden={index !== activeStageIndex}
            >
              <span className="wh-scroll-copy__eyebrow">{stage.eyebrow}</span>

              <h2 className="wh-scroll-copy__title">{stage.title}</h2>

              <p className="wh-scroll-copy__body">{stage.body}</p>
            </article>
          ))}
        </div>

        <div className="wh-scroll-progress" aria-hidden="true">
          <div
            className="wh-scroll-progress__fill"
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>

        <div className="wh-scroll-hint" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className="wh-scroll-hint__line" />
        </div>
      </div>
    </section>
  );
}
