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

export default function ScrollJourney() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const animationFrameRef = useRef(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const targetTimeRef = useRef(0);
  const smoothTimeRef = useRef(0);

  const lastRenderedProgressRef = useRef(-1);

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

    // Make sure browser never tries to play it normally.
    video.pause();

    return undefined;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video || !videoReady) return undefined;

    let destroyed = false;

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect();

      const viewportHeight =
        window.visualViewport?.height ||
        window.innerHeight ||
        document.documentElement.clientHeight;

      const scrollableDistance = Math.max(
        section.offsetHeight - viewportHeight,
        1,
      );

      return clamp(-rect.top / scrollableDistance);
    };

    const updateTarget = () => {
      const nextProgress = getScrollProgress();

      targetProgressRef.current = nextProgress;

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const safeDuration = Math.max(video.duration - 0.05, 0);

        targetTimeRef.current = nextProgress * safeDuration;
      }
    };

    const animate = () => {
      if (destroyed) return;

      /*
       * Smooth progression.
       *
       * Desktop:
       * slightly tighter response.
       *
       * Mobile:
       * slightly softer response to absorb momentum scrolling.
       */
      const isTouchDevice =
        window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0;

      const progressEase = isTouchDevice ? 0.11 : 0.14;
      const videoEase = isTouchDevice ? 0.1 : 0.13;

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

      /*
       * Avoid updating React on every tiny fractional movement.
       * This dramatically reduces unnecessary renders.
       */
      if (Math.abs(smoothProgress - lastRenderedProgressRef.current) > 0.002) {
        lastRenderedProgressRef.current = smoothProgress;
        setProgress(smoothProgress);
      }

      /*
       * Seeking too frequently can cause Safari / iPhone stutter.
       *
       * Only seek when we're far enough away from the target frame.
       */
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        Math.abs(video.currentTime - smoothTime) > 0.018
      ) {
        try {
          video.currentTime = smoothTime;
        } catch {
          // Browser may temporarily reject seeking while buffering.
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    updateTarget();

    /*
     * Initialise current values immediately.
     *
     * Prevents the video from animating from frame zero when the user
     * reloads the page while already halfway through the section.
     */
    targetProgressRef.current = getScrollProgress();
    smoothProgressRef.current = targetProgressRef.current;

    if (Number.isFinite(video.duration) && video.duration > 0) {
      const safeDuration = Math.max(video.duration - 0.05, 0);

      targetTimeRef.current = targetProgressRef.current * safeDuration;

      smoothTimeRef.current = targetTimeRef.current;

      try {
        video.currentTime = smoothTimeRef.current;
      } catch {
        // Safe fallback.
      }
    }

    setProgress(smoothProgressRef.current);

    const handleScroll = () => {
      updateTarget();
    };

    const handleResize = () => {
      updateTarget();
    };

    const handleViewportResize = () => {
      updateTarget();
    };

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
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;

            video.pause();

            try {
              video.currentTime = 0.001;
            } catch {
              // Safari can delay first seek.
            }

            setVideoReady(true);
          }}
          onCanPlay={(event) => {
            event.currentTarget.pause();
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
