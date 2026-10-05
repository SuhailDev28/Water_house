import { useEffect, useMemo, useRef, useState } from "react";

const FLAVOURS = {
  "White Peach": {
    key: "white-peach",
    label: "WHITE PEACH",
    tone: "peach",
    ingredients: [
      { type: "peach", className: "piece-one" },
      { type: "peach", className: "piece-two" },
      { type: "peach", className: "piece-three" },
    ],
  },

  "Strawberry Salt": {
    key: "strawberry-salt",
    label: "STRAWBERRY SALT",
    tone: "strawberry",
    ingredients: [
      { type: "strawberry", className: "piece-one" },
      { type: "strawberry", className: "piece-two" },
      { type: "strawberry", className: "piece-three" },
    ],
  },

  "Yuzu Mint": {
    key: "yuzu-mint",
    label: "YUZU MINT",
    tone: "yuzu",
    ingredients: [
      { type: "citrus", className: "piece-one" },
      { type: "mint", className: "piece-two" },
      { type: "mint", className: "piece-three" },
    ],
  },

  "Cucumber Lime": {
    key: "cucumber-lime",
    label: "CUCUMBER LIME",
    tone: "cucumber",
    ingredients: [
      { type: "cucumber", className: "piece-one" },
      { type: "lime", className: "piece-two" },
      { type: "cucumber", className: "piece-three" },
    ],
  },

  "Green Grape": {
    key: "green-grape",
    label: "GREEN GRAPE",
    tone: "grape",
    ingredients: [
      { type: "grape", className: "piece-one" },
      { type: "grape", className: "piece-two" },
      { type: "grape", className: "piece-three" },
    ],
  },

  "Coconut Pandan": {
    key: "coconut-pandan",
    label: "COCONUT PANDAN",
    tone: "pandan",
    ingredients: [
      { type: "coconut-piece", className: "piece-one" },
      { type: "pandan", className: "piece-two" },
      { type: "coconut-piece", className: "piece-three" },
    ],
  },
};

const BOOSTS = {
  Electrolytes: {
    label: "ELECTROLYTES",
    className: "electrolytes",
  },

  Magnesium: {
    label: "MAGNESIUM",
    className: "magnesium",
  },

  Creatine: {
    label: "CREATINE",
    className: "creatine",
  },

  Collagen: {
    label: "COLLAGEN",
    className: "collagen",
  },

  Caffeine: {
    label: "CAFFEINE",
    className: "caffeine",
  },

  "L-Theanine": {
    label: "L-THEANINE",
    className: "theanine",
  },
};

const BUBBLES = [
  { left: "12%", size: "xs", delay: "0s", duration: "2.2s" },
  { left: "20%", size: "sm", delay: "0.2s", duration: "2.6s" },
  { left: "29%", size: "md", delay: "0.5s", duration: "2.4s" },
  { left: "38%", size: "sm", delay: "0.8s", duration: "2.9s" },
  { left: "47%", size: "xs", delay: "1s", duration: "2.3s" },
  { left: "56%", size: "sm", delay: "0.1s", duration: "2.7s" },
  { left: "65%", size: "md", delay: "0.7s", duration: "2.5s" },
  { left: "74%", size: "xs", delay: "1.2s", duration: "2.8s" },
  { left: "83%", size: "sm", delay: "0.4s", duration: "2.4s" },
];

const ICE_CUBES = [
  { className: "ice-1", rotate: "-12deg" },
  { className: "ice-2", rotate: "10deg" },
  { className: "ice-3", rotate: "-6deg" },
  { className: "ice-4", rotate: "14deg" },
  { className: "ice-5", rotate: "-18deg" },
  { className: "ice-6", rotate: "7deg" },
  { className: "ice-7", rotate: "-9deg" },
  { className: "ice-8", rotate: "12deg" },
];

const ACTION_DURATION = {
  base: 1350,
  flavour: 1350,
  boost: 1200,
  remove: 700,
  stir: 1150,
  serve: 1350,
};

function IngredientShape({ type }) {
  if (type === "peach") {
    return (
      <span className="wh-svg-ingredient wh-svg-peach">
        <span className="wh-peach-skin" />
      </span>
    );
  }

  if (type === "strawberry") {
    return (
      <span className="wh-svg-ingredient wh-svg-strawberry">
        <span className="wh-strawberry-leaf" />
        <span className="wh-strawberry-seeds" />
      </span>
    );
  }

  if (type === "citrus") {
    return (
      <span className="wh-svg-ingredient wh-svg-citrus">
        <span className="wh-citrus-core" />
      </span>
    );
  }

  if (type === "mint") {
    return (
      <span className="wh-svg-ingredient wh-svg-leaf wh-svg-mint">
        <span />
      </span>
    );
  }

  if (type === "cucumber") {
    return (
      <span className="wh-svg-ingredient wh-svg-cucumber">
        <span className="wh-cucumber-center" />
      </span>
    );
  }

  if (type === "lime") {
    return (
      <span className="wh-svg-ingredient wh-svg-lime">
        <span className="wh-lime-core" />
      </span>
    );
  }

  if (type === "grape") {
    return (
      <span className="wh-svg-ingredient wh-svg-grape">
        <span />
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (type === "coconut-piece") {
    return (
      <span className="wh-svg-ingredient wh-svg-coconut-piece">
        <span />
      </span>
    );
  }

  if (type === "pandan") {
    return (
      <span className="wh-svg-ingredient wh-svg-pandan">
        <span />
      </span>
    );
  }

  return null;
}

function BasePourAnimation({ base }) {
  const coconut = base === "Coconut";

  return (
    <div className="wh-animation-event-layer">
      <div className="wh-live-source wh-live-source-bartender">
        {coconut ? (
          <>
            <div className="wh-brand-coconut">
              <div className="wh-coconut-outer">
                <div className="wh-coconut-inner" />
              </div>
            </div>

            <div className="wh-live-stream wh-live-stream-coconut" />
          </>
        ) : (
          <>
            <div className="wh-brand-carafe">
              <div className="wh-carafe-neck" />

              <div className="wh-carafe-body">
                <div className="wh-carafe-shine" />
              </div>
            </div>

            <div className="wh-live-stream" />
          </>
        )}
      </div>

      <div className="wh-pour-splash">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function FlavourAddAnimation({ flavourData }) {
  if (!flavourData) return null;

  return (
    <div className="wh-animation-event-layer">
      <div className="wh-bartender-bowl" aria-hidden="true">
        <div className="wh-bartender-bowl-inner" />
      </div>

      <div className="wh-live-flavour-rain">
        {flavourData.ingredients.map((ingredient, index) => (
          <div
            key={`${flavourData.key}-${ingredient.type}-${index}`}
            className={`wh-live-falling-piece ${ingredient.className}`}
          >
            <IngredientShape type={ingredient.type} />
          </div>
        ))}
      </div>

      <div className="wh-flavour-splash">
        <span />
        <span />
      </div>
    </div>
  );
}

function FunctionAddAnimation({ boostName }) {
  const data = BOOSTS[boostName];

  if (!data) return null;

  return (
    <div className="wh-animation-event-layer">
      <div
        className={[
          "wh-function-sachet",
          `wh-function-${data.className}`,
          "wh-function-sachet-bartender",
        ].join(" ")}
      >
        <span className="wh-function-logo">waterhouse</span>

        <span className="wh-function-name">{data.label}</span>
      </div>

      <div className="wh-function-powder">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            className={`wh-powder-position-${(index % 9) + 1}`}
            style={{
              animationDelay: `${index * 0.03}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RemoveFunctionAnimation() {
  return (
    <div className="wh-animation-event-layer wh-remove-event">
      <div className="wh-remove-ripple">
        <span />
        <span />
      </div>
    </div>
  );
}

function StirAnimation() {
  return (
    <div className="wh-animation-event-layer">
      <div className="wh-bartender-spoon" aria-hidden="true">
        <span />
      </div>

      <div className="wh-bartender-stir-ripple" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}

function ServeAnimation() {
  return (
    <div
      className="wh-animation-event-layer wh-serve-event"
      aria-hidden="true"
    />
  );
}

export default function DrinkBuilderAnimation({
  base = "",
  flavour = "",
  boosts = [],
}) {
  const [action, setAction] = useState(null);
  const [actionKey, setActionKey] = useState(0);
  const [storyLabel, setStoryLabel] = useState("Choose your water.");
  const [isFinished, setIsFinished] = useState(false);

  const followSlotRef = useRef(null);
  const followCardRef = useRef(null);

  const [followOffset, setFollowOffset] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);

  const previousBaseRef = useRef(base);
  const previousFlavourRef = useRef(flavour);
  const previousBoostsRef = useRef([...boosts]);

  const preparationTimersRef = useRef([]);

  const flavourData = useMemo(() => {
    return flavour ? FLAVOURS[flavour] || null : null;
  }, [flavour]);

  const hasBase = Boolean(base);
  const hasFlavour = Boolean(flavourData);

  const baseKey = useMemo(() => {
    if (!base) return "";

    return String(base).trim().toLowerCase().replace(/\s+/g, "-");
  }, [base]);

  const clearPreparationTimers = () => {
    preparationTimersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    preparationTimersRef.current = [];
  };

  const schedulePreparation = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    preparationTimersRef.current.push(timer);
    return timer;
  };

  const showAction = (nextAction, label) => {
    if (!nextAction) return;

    setIsFinished(nextAction.type === "serve");
    setStoryLabel(label);

    setAction({
      ...nextAction,
      id: Date.now(),
    });

    setActionKey((value) => value + 1);
  };

  const queuePreparation = (
    steps,
    { includeFinish = true, clearExisting = true } = {},
  ) => {
    if (clearExisting) {
      clearPreparationTimers();
    }

    setIsFinished(false);

    const queue = [...steps];

    if (includeFinish && hasBase && hasFlavour) {
      queue.push(
        {
          action: { type: "stir" },
          label: "Mixing your Water House ritual.",
          duration: ACTION_DURATION.stir,
          gap: 180,
        },
        {
          action: { type: "serve" },
          label: "Your Water House ritual is ready.",
          duration: ACTION_DURATION.serve,
          gap: 0,
        },
      );
    }

    let elapsed = 0;

    queue.forEach((step, index) => {
      const duration =
        step.duration || ACTION_DURATION[step.action?.type] || 1200;

      const gap = step.gap ?? 220;

      schedulePreparation(() => {
        showAction(step.action, step.label);
      }, elapsed);

      schedulePreparation(
        () => {
          setAction((currentAction) => {
            if (currentAction?.type === step.action?.type) {
              return null;
            }

            return currentAction;
          });
        },
        elapsed + duration + 40,
      );

      elapsed += duration + gap;

      if (index === queue.length - 1 && step.action?.type === "serve") {
        schedulePreparation(() => {
          setAction(null);
          setIsFinished(true);
          setStoryLabel("Your Water House ritual is ready.");
        }, elapsed + 40);
      }
    });
  };

  const fullPreparationSteps = () => {
    const steps = [];

    if (base) {
      steps.push({
        action: {
          type: "base",
          base,
        },
        label: `Pouring ${base.toLowerCase()} water.`,
        duration: ACTION_DURATION.base,
        gap: 240,
      });
    }

    if (flavourData) {
      steps.push({
        action: {
          type: "flavour",
          flavour,
        },
        label: `Adding ${flavour}.`,
        duration: ACTION_DURATION.flavour,
        gap: 220,
      });
    }

    boosts.forEach((boostName) => {
      steps.push({
        action: {
          type: "boost",
          boost: boostName,
        },
        label: `Adding ${boostName}.`,
        duration: ACTION_DURATION.boost,
        gap: 170,
      });
    });

    return steps;
  };

  const replayPreparation = () => {
    if (!hasBase) return;

    setReplayNonce((value) => value + 1);

    queuePreparation(fullPreparationSteps(), {
      includeFinish: hasFlavour,
    });
  };

  useEffect(() => {
    const previousBase = previousBaseRef.current;
    previousBaseRef.current = base;

    if (previousBase === base) {
      return;
    }

    clearPreparationTimers();

    if (!base) {
      setAction(null);
      setStoryLabel("Choose your water.");
      setIsFinished(false);
      return;
    }

    const steps = [
      {
        action: {
          type: "base",
          base,
        },
        label: `Pouring ${base.toLowerCase()} water.`,
        duration: ACTION_DURATION.base,
        gap: 220,
      },
    ];

    if (flavourData) {
      steps.push({
        action: {
          type: "flavour",
          flavour,
        },
        label: `Adding ${flavour}.`,
        duration: ACTION_DURATION.flavour,
        gap: 190,
      });

      boosts.forEach((boostName) => {
        steps.push({
          action: {
            type: "boost",
            boost: boostName,
          },
          label: `Adding ${boostName}.`,
          duration: ACTION_DURATION.boost,
          gap: 150,
        });
      });
    }

    queuePreparation(steps, {
      includeFinish: Boolean(flavourData),
      clearExisting: false,
    });
  }, [base]);

  useEffect(() => {
    const previousFlavour = previousFlavourRef.current;
    previousFlavourRef.current = flavour;

    if (previousFlavour === flavour) {
      return;
    }

    clearPreparationTimers();

    if (!flavourData) {
      setAction(null);
      setIsFinished(false);
      setStoryLabel(hasBase ? "Choose your flavour." : "Choose your water.");
      return;
    }

    const steps = [
      {
        action: {
          type: "flavour",
          flavour,
        },
        label: `Adding ${flavour}.`,
        duration: ACTION_DURATION.flavour,
        gap: 190,
      },
    ];

    boosts.forEach((boostName) => {
      steps.push({
        action: {
          type: "boost",
          boost: boostName,
        },
        label: `Adding ${boostName}.`,
        duration: ACTION_DURATION.boost,
        gap: 150,
      });
    });

    queuePreparation(steps, {
      includeFinish: true,
      clearExisting: false,
    });
  }, [flavour]);

  const boostsKey = boosts.join("|");

  useEffect(() => {
    const previousBoosts = previousBoostsRef.current || [];

    const addedBoosts = boosts.filter(
      (boostName) => !previousBoosts.includes(boostName),
    );

    const removedBoosts = previousBoosts.filter(
      (boostName) => !boosts.includes(boostName),
    );

    previousBoostsRef.current = [...boosts];

    if (!addedBoosts.length && !removedBoosts.length) {
      return;
    }

    clearPreparationTimers();

    const steps = [];

    removedBoosts.forEach((boostName) => {
      steps.push({
        action: {
          type: "remove",
          boost: boostName,
        },
        label: `${boostName} removed.`,
        duration: ACTION_DURATION.remove,
        gap: 120,
      });
    });

    addedBoosts.forEach((boostName) => {
      steps.push({
        action: {
          type: "boost",
          boost: boostName,
        },
        label: `Adding ${boostName}.`,
        duration: ACTION_DURATION.boost,
        gap: 160,
      });
    });

    queuePreparation(steps, {
      includeFinish: hasBase && hasFlavour,
      clearExisting: false,
    });
  }, [boostsKey]);

  useEffect(() => {
    if (!hasBase) {
      setStoryLabel("Choose your water.");
      setIsFinished(false);
      return;
    }

    if (hasBase && !hasFlavour && !action) {
      setStoryLabel("Choose your flavour.");
      setIsFinished(false);
    }
  }, [hasBase, hasFlavour, action]);

  useEffect(() => {
    return () => {
      clearPreparationTimers();
    };
  }, []);

  useEffect(() => {
    const slot = followSlotRef.current;
    const card = followCardRef.current;

    if (!slot || !card) return undefined;

    const getBuilder = () =>
      slot.closest(".wh-menu-builder-live") ||
      slot.closest(".wh-menu-builder") ||
      slot.parentElement;

    let frame = null;

    const updateFollow = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        const desktop = window.matchMedia("(min-width: 981px)").matches;

        if (!desktop) {
          setFollowOffset(0);
          return;
        }

        const builder = getBuilder();

        if (!builder) {
          setFollowOffset(0);
          return;
        }

        const slotRect = slot.getBoundingClientRect();
        const builderRect = builder.getBoundingClientRect();

        const headerOffset = 92;
        const cardHeight = card.offsetHeight;
        const maxOffset = Math.max(0, builder.scrollHeight - cardHeight);

        const desiredOffset = headerOffset - slotRect.top;

        const nextOffset = Math.min(maxOffset, Math.max(0, desiredOffset));

        const bottomLimitedOffset = Math.min(
          nextOffset,
          Math.max(0, builderRect.bottom - slotRect.bottom + maxOffset),
        );

        setFollowOffset(
          Number.isFinite(bottomLimitedOffset) ? bottomLimitedOffset : 0,
        );
      });
    };

    updateFollow();

    window.addEventListener("scroll", updateFollow, {
      passive: true,
    });

    window.addEventListener("resize", updateFollow);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateFollow)
        : null;

    resizeObserver?.observe(slot);
    resizeObserver?.observe(card);

    const builder = getBuilder();

    if (builder) {
      resizeObserver?.observe(builder);
    }

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateFollow);
      window.removeEventListener("resize", updateFollow);

      resizeObserver?.disconnect();
    };
  }, []);

  const statusText = useMemo(() => {
    if (isFinished) return "READY";
    if (!action) return "BUILD";

    if (action.type === "base") return "POURING WATER";
    if (action.type === "flavour") return "ADDING FLAVOUR";
    if (action.type === "boost") return "ADDING FUNCTION";
    if (action.type === "remove") return "UPDATING";
    if (action.type === "stir") return "MIXING";
    if (action.type === "serve") return "SERVING";

    return "MAKING";
  }, [action, isFinished]);

  const progress = useMemo(() => {
    if (!hasBase) return 0;
    if (!hasFlavour) return 33;
    if (hasFlavour && boosts.length === 0) return 66;
    return 100;
  }, [hasBase, hasFlavour, boosts.length]);

  return (
    <div ref={followSlotRef} className="wh-live-drink-follow-slot">
      <div
        ref={followCardRef}
        className="wh-live-drink wh-live-drink-story"
        style={{
          transform: `translate3d(0, ${followOffset}px, 0)`,
        }}
      >
        <div className="wh-live-drink-header">
          <span className="wh-live-kicker">MODERN HYDRATION RITUAL</span>

          <h3>
            Made for
            <br />
            <em>you.</em>
          </h3>

          <p>
            Watch your Water House cup come together with ice, fresh flavour and
            function.
          </p>
        </div>

        <div
          className={[
            "wh-live-scene",
            "wh-bartender-scene",
            hasBase ? `wh-live-base-${baseKey}` : "",
            hasFlavour ? `wh-live-tone-${flavourData.tone}` : "",
            !hasBase ? "wh-live-scene-empty" : "",
            action ? `wh-story-${action.type}` : "",
            action?.type === "base" ? "wh-liquid-is-pouring" : "",
            action?.type === "flavour" ? "wh-liquid-is-flavouring" : "",
            action?.type === "stir" ? "wh-liquid-is-mixing" : "",
            action?.type === "serve" ? "wh-liquid-is-serving" : "",
            isFinished ? "wh-story-finished wh-liquid-is-ready" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* BAR BACKDROP */}

          <div className="wh-bar-backdrop" aria-hidden="true">
            <div className="wh-bar-shelf wh-bar-shelf-one">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="wh-bar-shelf wh-bar-shelf-two">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="wh-live-light" />
          <div className="wh-live-floor" />

          {/* CURRENT BARTENDER ACTION */}

          {action && (
            <div
              key={`${replayNonce}-${actionKey}-${action.type}-${action.boost || action.flavour || action.base || ""}`}
            >
              {action.type === "base" && (
                <BasePourAnimation base={action.base} />
              )}

              {action.type === "flavour" && flavourData && (
                <FlavourAddAnimation flavourData={flavourData} />
              )}

              {action.type === "boost" && action.boost && (
                <FunctionAddAnimation boostName={action.boost} />
              )}

              {action.type === "remove" && <RemoveFunctionAnimation />}

              {action.type === "stir" && <StirAnimation />}

              {action.type === "serve" && <ServeAnimation />}
            </div>
          )}

          {/* PERSISTENT READY STATE — DOES NOT UNMOUNT WITH SERVE ACTION */}

          {isFinished && (
            <div className="wh-ready-badge wh-ready-badge-stable">
              <small>YOUR RITUAL</small>
              <strong>READY.</strong>
            </div>
          )}

          {/* PERSISTENT GLASS */}

          <div className="wh-cup-wrapper">
            <div className="wh-water-house-cup">
              <div className="wh-cup-lid" aria-hidden="true">
                <span className="wh-cup-lid-top" />
                <span className="wh-cup-lid-band" />
              </div>

              <div className="wh-cup-rim" />

              <div className="wh-cup-condensation" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, index) => (
                  <span key={index} className={`condensation-${index + 1}`} />
                ))}
              </div>

              {hasBase && (
                <div
                  className={[
                    "wh-drink-liquid",
                    `wh-drink-base-${baseKey}`,
                    hasFlavour ? `wh-drink-tone-${flavourData.tone}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="wh-drink-surface" />

                  <div className="wh-cup-ice" aria-hidden="true">
                    {ICE_CUBES.map((cube, index) => (
                      <span
                        key={cube.className}
                        className={`wh-ice-cube ${cube.className}`}
                        style={{ "--ice-rotate": cube.rotate }}
                      />
                    ))}
                  </div>

                  {base === "Sparkling" && (
                    <div className="wh-sparkling-field">
                      {BUBBLES.map(({ left, size, delay, duration }, index) => (
                        <span
                          key={index}
                          className={`wh-sparkle-bubble wh-bubble-${size}`}
                          style={{
                            left,
                            animationDelay: delay,
                            animationDuration: duration,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {hasFlavour && (
                    <div
                      key={`inside-${flavourData.key}`}
                      className="wh-cup-ingredients"
                    >
                      {[
                        ...flavourData.ingredients,
                        ...flavourData.ingredients,
                      ].map((ingredient, index) => (
                        <div
                          key={`${ingredient.type}-${index}`}
                          className={[
                            "wh-cup-piece",
                            `wh-cup-piece-${index + 1}`,
                            `wh-cup-piece-${ingredient.type}`,
                            `wh-motion-${ingredient.type}`,
                            index % 3 === 0
                              ? "wh-depth-back"
                              : index % 3 === 1
                                ? "wh-depth-mid"
                                : "wh-depth-front",
                          ].join(" ")}
                        >
                          <IngredientShape type={ingredient.type} />
                        </div>
                      ))}
                    </div>
                  )}

                  {boosts.length > 0 && (
                    <>
                      <div className="wh-function-cloud" aria-hidden="true">
                        {Array.from({ length: 18 }).map((_, index) => (
                          <span key={`cloud-${index}`} />
                        ))}
                      </div>

                      <div className="wh-function-dissolve">
                        {boosts.slice(0, 6).map((boost, index) => (
                          <span
                            key={boost}
                            className={[
                              "wh-function-dot",
                              `wh-function-dot-${index + 1}`,
                              `wh-active-function-${
                                BOOSTS[boost]?.className || ""
                              }`,
                            ].join(" ")}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="wh-cup-reflection wh-cup-reflection-one" />
              <div className="wh-cup-reflection wh-cup-reflection-two" />
              <div className="wh-cup-highlight-sweep" aria-hidden="true" />

              <div className="wh-cup-logo">
                <img
                  src="/water-house-logo.svg"
                  alt="Water House"
                  className="wh-cup-logo-image"
                />
              </div>
            </div>

            <div className="wh-cup-shadow" />
          </div>

          {/* LIVE STORY LABEL */}

          <div className="wh-bartender-story-card" aria-live="polite">
            <div className="wh-bartender-story-top">
              <span>WATER HOUSE BAR</span>

              <strong>{statusText}</strong>
            </div>

            <p>{storyLabel}</p>

            <div className="wh-bartender-progress">
              <span
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* CURRENT RECIPE */}

        <div className="wh-live-selection">
          <div className="wh-live-selection-item">
            <span>BASE</span>

            <strong>{base || "Choose"}</strong>
          </div>

          <div className="wh-live-selection-divider" />

          <div className="wh-live-selection-item">
            <span>FLAVOUR</span>

            <strong>{flavourData?.label || "Choose"}</strong>
          </div>

          <div className="wh-live-selection-divider" />

          <div className="wh-live-selection-item">
            <span>FUNCTION</span>

            <strong>
              {boosts.length ? `${boosts.length} ADDED` : "OPTIONAL"}
            </strong>
          </div>
        </div>

        {boosts.length > 0 && (
          <div className="wh-live-boost-list">
            {boosts.map((boost) => (
              <span
                key={boost}
                className={[
                  "wh-live-boost-pill",
                  BOOSTS[boost]?.className || "",
                ].join(" ")}
              >
                {boost}
              </span>
            ))}
          </div>
        )}

        {hasFlavour && isFinished && (
          <div className="wh-final-recipe-card wh-final-recipe-card-ready">
            <div className="wh-final-recipe-copy">
              <small>YOUR WATER</small>
              <strong>
                {[base, flavour, ...boosts].filter(Boolean).join(" · ")}
              </strong>
            </div>

            <button
              type="button"
              className="wh-replay-button"
              onClick={replayPreparation}
            >
              Replay preparation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
