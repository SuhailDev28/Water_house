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
    body:
      "Electrolytes, magnesium, creatine, collagen, caffeine and L-theanine.",
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

export default function ScrollJourney() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const activeStageIndex = useMemo(() => {
    const index = STAGES.findIndex(
      (stage) => progress >= stage.start && progress < stage.end,
    );
    return index === -1 ? STAGES.length - 1 : index;
  }, [progress]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video || !videoReady) return undefined;

    const update = () => {
      frameRef.current = 0;

      const rect = section.getBoundingClientRect();
      const distance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );

      const nextProgress = clamp(-rect.top / distance);
      setProgress((current) =>
        Math.abs(current - nextProgress) > 0.001 ? nextProgress : current,
      );

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const safeDuration = Math.max(video.duration - 0.04, 0);
        const targetTime = nextProgress * safeDuration;

        if (Math.abs(video.currentTime - targetTime) > 0.025) {
          try {
            video.currentTime = targetTime;
          } catch {
            // Some browsers briefly reject seeking before the first frame is ready.
          }
        }
      }
    };

    const requestUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
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
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setVideoReady(true);

            try {
              video.currentTime = 0.001;
            } catch {
              // Safe fallback for browsers that delay the first seek.
            }
          }}
        />

        <div className="wh-scroll-journey__shade" />

        <div className="wh-scroll-journey__content">
          {STAGES.map((stage, index) => (
            <article
              key={stage.eyebrow + index}
              className={[
                "wh-scroll-copy",
                `wh-scroll-copy--${stage.align}`,
                index === activeStageIndex ? "is-active" : "",
              ].join(" ")}
              aria-hidden={index !== activeStageIndex}
            >
              <span className="wh-scroll-copy__eyebrow">
                {stage.eyebrow}
              </span>

              <h2 className="wh-scroll-copy__title">{stage.title}</h2>

              <p className="wh-scroll-copy__body">{stage.body}</p>
            </article>
          ))}
        </div>

        <div className="wh-scroll-progress" aria-hidden="true">
          <div
            className="wh-scroll-progress__fill"
            style={{ transform: `scaleX(${progress})` }}
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
