import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "../services/api";

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
  const [selectedBase, setSelectedBase] = useState("Still");
  const [selectedFlavour, setSelectedFlavour] = useState("White Peach");
  const [selectedBoosts, setSelectedBoosts] = useState([]);

  useEffect(() => {
    api("/content/menu")
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setItems(data);

          if (!data.some((item) => item.name === selectedFlavour)) {
            setSelectedFlavour(data[0]?.name || "White Peach");
          }
        }
      })
      .catch(() => {});
    // selectedFlavour is intentionally not a dependency here.
    // We only sync the default selection when CMS content arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDrink = useMemo(
    () => ({
      base: selectedBase,
      flavour: selectedFlavour,
      boosts: selectedBoosts,
    }),
    [selectedBase, selectedFlavour, selectedBoosts],
  );

  const toggleBoost = (name) => {
    setSelectedBoosts((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  };

  return (
    <main className="wh-menu-page">
      {/* HERO */}
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

      {/* INTRO */}
      <section className="wh-menu-intro">
        <span className="section-pill">YOUR WATER. YOUR WAY.</span>

        <h2>
          Three steps.
          <br />
          <em>One ritual.</em>
        </h2>

        <p>Build a Water House drink around your taste, mood and day.</p>
      </section>

      {/* BUILDER */}
      <section id="build-water" className="wh-menu-builder">
        {/* STEP 1 */}
        <div className="wh-builder-step">
          <div className="wh-builder-step-head">
            <span className="wh-builder-step-number">01</span>

            <div>
              <small>START WITH</small>
              <h3>Choose your water.</h3>
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
                  onClick={() => setSelectedBase(name)}
                  aria-pressed={active}
                >
                  <div className="wh-card-icon">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>

                  <div className="wh-base-copy">
                    <strong>{name}</strong>
                    <p>{description}</p>
                  </div>

                  <span className="wh-select-icon">
                    {active ? <Check size={15} /> : <Plus size={15} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2 */}
        <div className="wh-builder-step">
          <div className="wh-builder-step-head">
            <span className="wh-builder-step-number">02</span>

            <div>
              <small>NEXT COMES</small>
              <h3>Choose your flavour.</h3>
            </div>
          </div>

          <div className="wh-flavour-grid">
            {items.map((item, index) => {
              const active = selectedFlavour === item.name;

              return (
                <button
                  type="button"
                  key={item._id || item.name}
                  className={`wh-flavour-card ${
                    flavourClassNames[index % flavourClassNames.length]
                  } ${active ? "active" : ""}`}
                  onClick={() => setSelectedFlavour(item.name)}
                  aria-pressed={active}
                >
                  <div className="wh-flavour-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="wh-flavour-copy">
                    <small>{item.category || "FLAVOUR"}</small>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>

                    {item.price > 0 && (
                      <strong className="wh-menu-price">
                        QAR {item.price}
                      </strong>
                    )}
                  </div>

                  <span className="wh-select-icon">
                    {active ? <Check size={15} /> : <Plus size={15} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3 */}
        <div className="wh-builder-step">
          <div className="wh-builder-step-head">
            <span className="wh-builder-step-number">03</span>

            <div>
              <small>MAKE IT WORK</small>
              <h3>Add what your day needs.</h3>
            </div>
          </div>

          <div className="wh-boost-grid">
            {boosts.map(({ name, description, className, icon: Icon }) => {
              const active = selectedBoosts.includes(name);

              return (
                <button
                  type="button"
                  key={name}
                  className={`wh-boost-card ${className} ${
                    active ? "active" : ""
                  }`}
                  onClick={() => toggleBoost(name)}
                  aria-pressed={active}
                >
                  <div className="wh-boost-top">
                    <Icon size={24} strokeWidth={1.4} />

                    <span className="wh-select-icon wh-select-icon-static">
                      {active ? <Check size={15} /> : <Plus size={15} />}
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
        </div>
      </section>

      {/* SUMMARY */}
      <section className="wh-menu-summary">
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

          <p>Your current Water House combination is ready.</p>
        </div>

        <div className="wh-menu-order-card">
          <div className="wh-order-row">
            <small>BASE</small>
            <strong>{selectedDrink.base}</strong>
          </div>

          <div className="wh-order-row">
            <small>FLAVOUR</small>
            <strong>{selectedDrink.flavour}</strong>
          </div>

          <div className="wh-order-row">
            <small>FUNCTION</small>
            <strong>
              {selectedDrink.boosts.length
                ? selectedDrink.boosts.join(", ")
                : "Your choice"}
            </strong>
          </div>

          <a href="/contact" className="wh-menu-summary-button">
            Save your ritual
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* BRAND STORY */}
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
