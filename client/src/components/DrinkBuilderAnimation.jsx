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
  { left: "31%", size: "xs", delay: "1.5s", duration: "2.6s" },
  { left: "52%", size: "md", delay: "1.7s", duration: "2.9s" },
  { left: "70%", size: "sm", delay: "1.4s", duration: "2.3s" },
];

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
      <div className="wh-live-source">
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
        className={["wh-function-sachet", `wh-function-${data.className}`].join(
          " ",
        )}
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

function FunctionRemoveAnimation() {
  return (
    <div className="wh-animation-event-layer wh-remove-event">
      <div className="wh-remove-ripple">
        <span />
        <span />
      </div>
    </div>
  );
}

export default function DrinkBuilderAnimation({
  base = "",
  flavour = "",
  boosts = [],
}) {
  const [eventType, setEventType] = useState("idle");
  const [eventKey, setEventKey] = useState(0);
  const [latestBoost, setLatestBoost] = useState("");
  const [removedBoost, setRemovedBoost] = useState("");

  const previousBase = useRef(base);
  const previousFlavour = useRef(flavour);
  const previousBoosts = useRef([...boosts]);

  const flavourData = useMemo(() => {
    return flavour ? FLAVOURS[flavour] || null : null;
  }, [flavour]);

  const hasBase = Boolean(base);
  const hasFlavour = Boolean(flavourData);

  const baseKey = useMemo(() => {
    if (!base) return "";
    return String(base).trim().toLowerCase().replace(/\s+/g, "-");
  }, [base]);

  useEffect(() => {
    if (previousBase.current === base) return;

    previousBase.current = base;

    if (!base) {
      setEventType("idle");
      return;
    }

    setEventType("base");
    setEventKey((value) => value + 1);
  }, [base]);

  useEffect(() => {
    if (previousFlavour.current === flavour) return;

    previousFlavour.current = flavour;

    if (!flavour) {
      setEventType("idle");
      return;
    }

    setEventType("flavour");
    setEventKey((value) => value + 1);
  }, [flavour]);

  const boostsKey = boosts.join("|");

  useEffect(() => {
    const before = previousBoosts.current || [];
    const added = boosts.find((item) => !before.includes(item));
    const removed = before.find((item) => !boosts.includes(item));

    previousBoosts.current = [...boosts];

    if (added) {
      setLatestBoost(added);
      setRemovedBoost("");
      setEventType("boost-add");
      setEventKey((value) => value + 1);
      return;
    }

    if (removed) {
      setRemovedBoost(removed);
      setLatestBoost("");
      setEventType("boost-remove");
      setEventKey((value) => value + 1);
      return;
    }
  }, [boostsKey]);

  return (
    <div className="wh-live-drink">
      <div className="wh-live-drink-header">
        <span className="wh-live-kicker">MODERN HYDRATION RITUAL</span>

        <h3>
          Make your
          <br />
          <em>water.</em>
        </h3>

        <p>Build it one layer at a time.</p>
      </div>

      <div
        className={[
          "wh-live-scene",
          hasBase ? `wh-live-base-${baseKey}` : "",
          hasFlavour ? `wh-live-tone-${flavourData.tone}` : "",
          !hasBase ? "wh-live-scene-empty" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="wh-live-light" />
        <div className="wh-live-floor" />

        {eventType === "base" && hasBase && (
          <div key={`base-${eventKey}`}>
            <BasePourAnimation base={base} />
          </div>
        )}

        {eventType === "flavour" && flavourData && (
          <div key={`flavour-${eventKey}`}>
            <FlavourAddAnimation flavourData={flavourData} />
          </div>
        )}

        {eventType === "boost-add" && latestBoost && (
          <div key={`boost-add-${eventKey}`}>
            <FunctionAddAnimation boostName={latestBoost} />
          </div>
        )}

        {eventType === "boost-remove" && removedBoost && (
          <div key={`boost-remove-${eventKey}`}>
            <FunctionRemoveAnimation />
          </div>
        )}

        <div className="wh-cup-wrapper">
          <div className="wh-water-house-cup">
            <div className="wh-cup-rim" />

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
                    {flavourData.ingredients.map((ingredient, index) => (
                      <div
                        key={`${ingredient.type}-${index}`}
                        className={`wh-cup-piece wh-cup-piece-${index + 1}`}
                      >
                        <IngredientShape type={ingredient.type} />
                      </div>
                    ))}
                  </div>
                )}

                {boosts.length > 0 && (
                  <div className="wh-function-dissolve">
                    {boosts.slice(0, 6).map((boost, index) => (
                      <span
                        key={boost}
                        className={[
                          "wh-function-dot",
                          `wh-function-dot-${index + 1}`,
                          `wh-active-function-${BOOSTS[boost]?.className || ""}`,
                        ].join(" ")}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="wh-cup-reflection wh-cup-reflection-one" />
            <div className="wh-cup-reflection wh-cup-reflection-two" />

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
      </div>

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
    </div>
  );
}
