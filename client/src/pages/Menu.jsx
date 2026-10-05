import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowDown,
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  Plus,
  RefreshCcw,
  Sparkles,
  Zap,
} from "lucide-react";

import { api } from "../services/api";
import DrinkBuilderAnimation from "../components/DrinkBuilderAnimation";

import "../styles/drink-builder-animation.css";

const fallback = [
  {
    name: "White Peach",
    category: "Flavour",
    description: "Soft white peach. Light, juicy and clean.",
    price: 0,
  },
  {
    name: "Strawberry Salt",
    category: "Flavour",
    description: "Fresh strawberry with a bright saline finish.",
    price: 0,
  },
  {
    name: "Yuzu Mint",
    category: "Flavour",
    description: "Citrus lift with cool fresh mint.",
    price: 0,
  },
  {
    name: "Cucumber Lime",
    category: "Flavour",
    description: "Crisp cucumber with fresh lime.",
    price: 0,
  },
  {
    name: "Green Grape",
    category: "Flavour",
    description: "Clean, juicy green grape.",
    price: 0,
  },
  {
    name: "Coconut Pandan",
    category: "Flavour",
    description: "Smooth coconut with aromatic pandan.",
    price: 0,
  },
];

const bases = [
  {
    name: "Still",
    description: "Clean, calm and simple.",
    icon: Droplets,
  },
  {
    name: "Sparkling",
    description: "Bright, crisp and lively.",
    icon: Sparkles,
  },
  {
    name: "Coconut",
    description: "Soft, tropical and naturally smooth.",
    icon: Leaf,
  },
];

const boosts = [
  {
    name: "Electrolytes",
    description: "Hydrate deeper.",
    className: "wh-boost-peach",
    icon: Droplets,
  },
  {
    name: "Magnesium",
    description: "Slow down. Reset.",
    className: "wh-boost-coco",
    icon: Sparkles,
  },
  {
    name: "Creatine",
    description: "Bring the power.",
    className: "wh-boost-leaf",
    icon: Zap,
  },
  {
    name: "Collagen",
    description: "Beauty from within.",
    className: "wh-boost-rose",
    icon: Sparkles,
  },
  {
    name: "Caffeine",
    description: "Wake your day.",
    className: "wh-boost-cherry",
    icon: Zap,
  },
  {
    name: "L-Theanine",
    description: "Find your focus.",
    className: "wh-boost-matcha",
    icon: Leaf,
  },
];

const flavourClassNames = [
  "wh-flavour-peach",
  "wh-flavour-strawberry",
  "wh-flavour-yuzu",
  "wh-flavour-cucumber",
  "wh-flavour-grape",
  "wh-flavour-coconut",
];

export default function Menu() {
  const [items, setItems] = useState(fallback);

  /*
   * No default selections.
   * The user must explicitly choose water and flavour.
   */
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedFlavour, setSelectedFlavour] = useState("");
  const [selectedBoosts, setSelectedBoosts] = useState([]);

  const [activeStep, setActiveStep] = useState(1);

  const waterStepRef = useRef(null);
  const flavourStepRef = useRef(null);
  const functionStepRef = useRef(null);

  useEffect(() => {
    api("/content/menu")
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setItems(data);
        }
      })
      .catch(() => {});
  }, []);

  const selectedDrink = useMemo(
    () => ({
      base: selectedBase,
      flavour: selectedFlavour,
      boosts: selectedBoosts,
    }),
    [selectedBase, selectedFlavour, selectedBoosts],
  );

  /*
   * Function is optional.
   *
   * 0%  = nothing selected
   * 33% = water selected
   * 66% = water + flavour selected
   * 100% = function also added
   */
  const progress = useMemo(() => {
    if (!selectedBase && !selectedFlavour) {
      return 0;
    }

    if (selectedBase && !selectedFlavour) {
      return 33;
    }

    if (selectedBase && selectedFlavour && selectedBoosts.length === 0) {
      return 66;
    }

    return 100;
  }, [selectedBase, selectedFlavour, selectedBoosts]);

  const isDrinkReady = Boolean(selectedBase) && Boolean(selectedFlavour);

  const toggleBoost = (name) => {
    /*
     * Prevent functions being added before the
     * required base + flavour selections.
     */
    if (!isDrinkReady) {
      return;
    }

    setSelectedBoosts((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  };

  const scrollToStep = (step) => {
    /*
     * Step 2 requires water.
     */
    if (step === 2 && !selectedBase) {
      setActiveStep(1);

      waterStepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    /*
     * Step 3 requires water + flavour.
     */
    if (step === 3 && (!selectedBase || !selectedFlavour)) {
      const target = !selectedBase
        ? waterStepRef.current
        : flavourStepRef.current;

      setActiveStep(!selectedBase ? 1 : 2);

      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setActiveStep(step);

    const target =
      step === 1
        ? waterStepRef.current
        : step === 2
          ? flavourStepRef.current
          : functionStepRef.current;

    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const resetRitual = () => {
    setSelectedBase("");
    setSelectedFlavour("");
    setSelectedBoosts([]);
    setActiveStep(1);

    requestAnimationFrame(() => {
      waterStepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  return (
    <main className="wh-menu-page">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="wh-menu-hero">
        <div className="wh-menu-hero-copy">
          <img
            src="/water-house-logo.svg"
            alt="Water House"
            className="wh-menu-hero-logo"
          />

          <span className="wh-menu-eyebrow">MODERN HYDRATION RITUAL</span>

          <h1>
            Build your
            <br />
            <em>water.</em>
          </h1>

          <p>
            Start with still, sparkling or coconut water. Add fresh flavour. Add
            what your day needs. Make it completely yours.
          </p>

          <a href="#build-water" className="wh-menu-primary-cta">
            Build your ritual
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="wh-menu-hero-image">
          <img src="/flavours.jpg" alt="Water House fresh flavours" />

          <div className="wh-menu-image-label">
            <span>FRESH.</span>
            <span>FUNCTIONAL.</span>
            <span>PERSONAL.</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="wh-menu-intro">
        <span className="section-pill">YOUR WATER. YOUR WAY.</span>

        <h2>
          Three steps.
          <br />
          <em>One ritual.</em>
        </h2>

        <p>Build a Water House drink around your taste, mood and day.</p>
      </section>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <section className="wh-builder-progress-wrap">
        <div className="wh-builder-progress-top">
          <div>
            <span className="wh-builder-progress-kicker">
              BUILD YOUR RITUAL
            </span>

            <strong>{progress}% complete</strong>
          </div>

          <button
            type="button"
            className="wh-builder-reset"
            onClick={resetRitual}
            disabled={
              !selectedBase && !selectedFlavour && selectedBoosts.length === 0
            }
          >
            <RefreshCcw size={14} />
            Reset
          </button>
        </div>

        <div className="wh-builder-progress-bar">
          <span
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="wh-builder-step-tabs">
          {/* WATER TAB */}

          <button
            type="button"
            className={activeStep === 1 ? "active" : ""}
            onClick={() => scrollToStep(1)}
          >
            <span>01</span>

            <div>
              <small>WATER</small>

              <strong>{selectedBase || "Choose water"}</strong>
            </div>

            {selectedBase ? <Check size={16} /> : <Plus size={16} />}
          </button>

          {/* FLAVOUR TAB */}

          <button
            type="button"
            className={activeStep === 2 ? "active" : ""}
            onClick={() => scrollToStep(2)}
          >
            <span>02</span>

            <div>
              <small>FLAVOUR</small>

              <strong>{selectedFlavour || "Choose flavour"}</strong>
            </div>

            {selectedFlavour ? <Check size={16} /> : <Plus size={16} />}
          </button>

          {/* FUNCTION TAB */}

          <button
            type="button"
            className={activeStep === 3 ? "active" : ""}
            onClick={() => scrollToStep(3)}
          >
            <span>03</span>

            <div>
              <small>FUNCTION</small>

              <strong>
                {selectedBoosts.length
                  ? `${selectedBoosts.length} added`
                  : "Optional"}
              </strong>
            </div>

            {selectedBoosts.length > 0 ? (
              <Check size={16} />
            ) : (
              <Plus size={16} />
            )}
          </button>
        </div>
      </section>

      {/* =====================================================
          LIVE BUILDER
      ====================================================== */}

      <section
        id="build-water"
        className="wh-menu-builder wh-menu-builder-live"
      >
        {/* =================================================
            LIVE DRINK
        ================================================== */}

        <div className="wh-builder-animation-column">
          <DrinkBuilderAnimation
            base={selectedBase}
            flavour={selectedFlavour}
            boosts={selectedBoosts}
          />
        </div>

        {/* =================================================
            OPTIONS
        ================================================== */}

        <div className="wh-builder-options-column">
          {/* =================================================
              STEP 01 — WATER
          ================================================== */}

          <div
            ref={waterStepRef}
            className={`wh-builder-step wh-builder-step-upgraded ${
              activeStep === 1 ? "active-step" : ""
            }`}
            onMouseEnter={() => setActiveStep(1)}
          >
            <div className="wh-builder-step-head">
              <span className="wh-builder-step-number">01</span>

              <div>
                <small>START WITH</small>

                <h3>Choose your water.</h3>
              </div>

              <div className="wh-step-current-selection">
                <small>{selectedBase ? "SELECTED" : "CHOOSE ONE"}</small>

                <strong>{selectedBase || "—"}</strong>
              </div>
            </div>

            <div className="wh-base-grid">
              {bases.map(({ name, description, icon: Icon }) => {
                const active = selectedBase === name;

                return (
                  <button
                    key={name}
                    type="button"
                    className={`wh-base-card ${active ? "active" : ""}`}
                    onClick={() => {
                      setSelectedBase(name);
                      setActiveStep(1);

                      /*
                       * If base changes after
                       * later selections were made,
                       * keep flavour + functions.
                       * This lets animation rebuild
                       * only the water layer.
                       */
                    }}
                    aria-pressed={active}
                  >
                    <div className="wh-card-icon">
                      <Icon size={27} strokeWidth={1.5} />
                    </div>

                    <div className="wh-base-copy">
                      <strong>{name}</strong>

                      <p>{description}</p>
                    </div>

                    <span className="wh-select-icon">
                      {active ? <Check size={17} /> : <Plus size={17} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="wh-step-next-button"
              disabled={!selectedBase}
              onClick={() => scrollToStep(2)}
            >
              {selectedBase
                ? "Next — choose flavour"
                : "Choose your water first"}

              <ArrowDown size={16} />
            </button>
          </div>

          {/* =================================================
              STEP 02 — FLAVOUR
          ================================================== */}

          <div
            ref={flavourStepRef}
            className={`wh-builder-step wh-builder-step-upgraded ${
              activeStep === 2 ? "active-step" : ""
            }`}
            onMouseEnter={() => {
              if (selectedBase) {
                setActiveStep(2);
              }
            }}
          >
            <div className="wh-builder-step-head">
              <span className="wh-builder-step-number">02</span>

              <div>
                <small>NEXT COMES</small>

                <h3>Choose your flavour.</h3>
              </div>

              <div className="wh-step-current-selection">
                <small>{selectedFlavour ? "SELECTED" : "CHOOSE ONE"}</small>

                <strong>{selectedFlavour || "—"}</strong>
              </div>
            </div>

            {!selectedBase && (
              <div className="wh-step-lock-message">
                <Droplets size={18} strokeWidth={1.5} />

                <span>Choose your water before adding flavour.</span>
              </div>
            )}

            <div
              className={`wh-flavour-grid ${
                !selectedBase ? "wh-options-disabled" : ""
              }`}
            >
              {items.map((item, index) => {
                const active = selectedFlavour === item.name;

                return (
                  <button
                    type="button"
                    key={item._id || item.name}
                    disabled={!selectedBase}
                    className={`wh-flavour-card ${
                      flavourClassNames[index % flavourClassNames.length]
                    } ${active ? "active" : ""}`}
                    onClick={() => {
                      setSelectedFlavour(item.name);

                      setActiveStep(2);
                    }}
                    aria-pressed={active}
                  >
                    <div className="wh-flavour-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="wh-flavour-copy">
                      <small>{item.category || "FLAVOUR"}</small>

                      <h3>{item.name}</h3>

                      <p>{item.description}</p>

                      {Number(item.price) > 0 && (
                        <strong className="wh-menu-price">
                          QAR {item.price}
                        </strong>
                      )}
                    </div>

                    <span className="wh-select-icon">
                      {active ? <Check size={17} /> : <Plus size={17} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="wh-step-next-button"
              disabled={!selectedBase || !selectedFlavour}
              onClick={() => scrollToStep(3)}
            >
              {selectedFlavour
                ? "Next — add function"
                : "Choose your flavour first"}

              <ArrowDown size={16} />
            </button>
          </div>

          {/* =================================================
              STEP 03 — FUNCTION
          ================================================== */}

          <div
            ref={functionStepRef}
            className={`wh-builder-step wh-builder-step-upgraded ${
              activeStep === 3 ? "active-step" : ""
            }`}
            onMouseEnter={() => {
              if (isDrinkReady) {
                setActiveStep(3);
              }
            }}
          >
            <div className="wh-builder-step-head">
              <span className="wh-builder-step-number">03</span>

              <div>
                <small>MAKE IT WORK</small>

                <h3>Add what your day needs.</h3>
              </div>

              <div className="wh-step-current-selection">
                <small>{selectedBoosts.length ? "SELECTED" : "OPTIONAL"}</small>

                <strong>
                  {selectedBoosts.length ? selectedBoosts.length : "—"}
                </strong>
              </div>
            </div>

            <p className="wh-function-helper">
              Add one or combine several functions. Your drink updates with
              every selection.
            </p>

            {!isDrinkReady && (
              <div className="wh-step-lock-message">
                <Sparkles size={18} strokeWidth={1.5} />

                <span>Choose water and flavour before adding function.</span>
              </div>
            )}

            <div
              className={`wh-boost-grid ${
                !isDrinkReady ? "wh-options-disabled" : ""
              }`}
            >
              {boosts.map(({ name, description, className, icon: Icon }) => {
                const active = selectedBoosts.includes(name);

                return (
                  <button
                    type="button"
                    key={name}
                    disabled={!isDrinkReady}
                    className={`wh-boost-card ${className} ${
                      active ? "active" : ""
                    }`}
                    onClick={() => {
                      toggleBoost(name);

                      setActiveStep(3);
                    }}
                    aria-pressed={active}
                  >
                    <div className="wh-boost-top">
                      <Icon size={27} strokeWidth={1.4} />

                      <span className="wh-select-icon wh-select-icon-static">
                        {active ? <Check size={17} /> : <Plus size={17} />}
                      </span>
                    </div>

                    <div>
                      <small>FUNCTION</small>

                      <h3>{name}</h3>

                      <p>{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedBoosts.length > 0 && (
              <div className="wh-selected-functions">
                <small>YOUR FUNCTIONS</small>

                <div>
                  {selectedBoosts.map((boost) => (
                    <button
                      type="button"
                      key={boost}
                      onClick={() => toggleBoost(boost)}
                    >
                      {boost}

                      <span>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isDrinkReady && (
              <div className="wh-function-optional-note">
                Function is optional. Your water is already ready with your
                selected base and flavour.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <section className="wh-menu-summary wh-menu-summary-upgraded">
        <div className="wh-menu-summary-copy">
          <img
            src="/water-house-logo.svg"
            alt="Water House"
            className="wh-menu-summary-logo"
          />

          <span className="section-pill wh-light-pill">YOUR RITUAL</span>

          <h2>
            Made by you.
            <br />
            <em>Made fresh.</em>
          </h2>

          <p>
            {isDrinkReady
              ? "Your current Water House combination."
              : "Choose your water and flavour to build your ritual."}
          </p>
        </div>

        <div className="wh-menu-order-card">
          <div className="wh-order-card-title">
            <span>YOUR WATER</span>

            <strong>{isDrinkReady ? "Ready." : "Build it."}</strong>
          </div>

          <div
            className={`wh-order-row ${
              selectedDrink.base ? "is-complete" : ""
            }`}
          >
            <small>01 / BASE</small>

            <strong>{selectedDrink.base || "Not selected"}</strong>
          </div>

          <div
            className={`wh-order-row ${
              selectedDrink.flavour ? "is-complete" : ""
            }`}
          >
            <small>02 / FLAVOUR</small>

            <strong>{selectedDrink.flavour || "Not selected"}</strong>
          </div>

          <div
            className={`wh-order-row ${
              selectedDrink.boosts.length ? "is-complete" : ""
            }`}
          >
            <small>03 / FUNCTION</small>

            <strong>
              {selectedDrink.boosts.length
                ? selectedDrink.boosts.join(", ")
                : "Optional"}
            </strong>
          </div>

          <div className="wh-order-actions">
            <button
              type="button"
              className="wh-order-reset"
              onClick={resetRitual}
              disabled={
                !selectedBase && !selectedFlavour && selectedBoosts.length === 0
              }
            >
              <RefreshCcw size={15} />
              Start again
            </button>

            {isDrinkReady ? (
              <a href="/contact" className="wh-menu-summary-button">
                Save your ritual
                <ArrowRight size={18} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="wh-menu-summary-button wh-summary-disabled"
              >
                Choose water + flavour
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          BRAND STORY
      ====================================================== */}

      <section className="wh-menu-story">
        <span className="wh-menu-story-kicker">WATER HOUSE</span>

        <h2>
          Freshly made.
          <br />
          Functional.
          <br />
          <em>Personal.</em>
        </h2>

        <div className="wh-menu-story-values">
          <div>
            <span>01</span>
            <strong>HYDRATION</strong>
          </div>

          <div>
            <span>02</span>
            <strong>FLAVOUR</strong>
          </div>

          <div>
            <span>03</span>
            <strong>FUNCTION</strong>
          </div>

          <div>
            <span>04</span>
            <strong>COMMUNITY</strong>
          </div>
        </div>

        <p>
          A simple daily ritual for feeling good, moving well and making water
          matter.
        </p>
      </section>
    </main>
  );
}
