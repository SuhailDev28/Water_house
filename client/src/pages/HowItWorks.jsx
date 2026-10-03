import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  Sparkles,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    kicker: "START WITH",
    title: "Choose your water",
    description:
      "Still, sparkling or coconut water. Select the temperature that feels right.",
    icon: Droplets,
    className: "ritual-step-coco",
  },
  {
    number: "02",
    kicker: "NEXT COMES",
    title: "Add flavour",
    description:
      "Choose from bright fruit, herbs and distinctive flavour pairings.",
    icon: Leaf,
    className: "ritual-step-peach",
  },
  {
    number: "03",
    kicker: "MAKE IT WORK",
    title: "Add function",
    description:
      "Layer in electrolytes, magnesium, creatine, collagen, caffeine or L-theanine.",
    icon: Zap,
    className: "ritual-step-matcha",
  },
  {
    number: "04",
    kicker: "FINISH YOUR RITUAL",
    title: "Make it yours",
    description:
      "Prepared fresh, built around your taste, mood and day.",
    icon: Sparkles,
    className: "ritual-step-cherry",
  },
];

const functions = [
  "Hydration",
  "Energy",
  "Focus",
  "Recovery",
];

export default function HowItWorks() {
  return (
    <main className="ritual-page">

      {/* HERO */}
      <section className="ritual-hero">
        <div className="ritual-hero-copy">
          <img
            src="/water-house-logo.svg"
            alt="Water House"
            className="ritual-hero-logo"
          />

          <span className="ritual-eyebrow">
            MODERN HYDRATION RITUAL
          </span>

          <h1>
            Three choices.
            <br />
            <em>One final ritual.</em>
          </h1>

          <p>
            A deliberately simple experience that puts water first,
            then lets you shape everything around it.
          </p>

          <a href="#ritual-steps" className="ritual-primary-cta">
            See how it works
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="ritual-hero-visual">
          <div className="ritual-hero-card">
            <span className="ritual-hero-card-label">
              YOUR WATER. YOUR WAY.
            </span>

            <div className="ritual-hero-line">
              <span>01</span>
              <strong>Water</strong>
            </div>

            <div className="ritual-hero-line">
              <span>02</span>
              <strong>Flavour</strong>
            </div>

            <div className="ritual-hero-line">
              <span>03</span>
              <strong>Function</strong>
            </div>

            <div className="ritual-hero-line">
              <span>04</span>
              <strong>Your ritual</strong>
            </div>
          </div>
        </div>
      </section>


      {/* INTRO */}
      <section className="ritual-intro">
        <span className="section-pill">
          THE RITUAL
        </span>

        <h2>
          Simple by design.
          <br />
          <em>Personal by nature.</em>
        </h2>

        <p>
          Water House starts with something simple: water.
          From there, you choose the flavour, the function,
          and the way it fits into your day.
        </p>
      </section>


      {/* STEPS */}
      <section id="ritual-steps" className="ritual-steps-grid">
        {steps.map(
          ({
            number,
            kicker,
            title,
            description,
            icon: Icon,
            className,
          }) => (
            <article
              className={`ritual-step-card ${className}`}
              key={number}
            >
              <div className="ritual-step-top">
                <span className="ritual-step-number">
                  {number}
                </span>

                <Icon
                  size={28}
                  strokeWidth={1.4}
                />
              </div>

              <div className="ritual-step-content">
                <small>{kicker}</small>

                <h3>{title}</h3>

                <p>{description}</p>
              </div>
            </article>
          )
        )}
      </section>


      {/* FUNCTION SECTION */}
      <section className="ritual-function-section">
        <div className="ritual-function-image">
          <img
            src="/functions.jpg"
            alt="Water House functional boosts"
          />

          <span className="ritual-image-label">
            MAKE WATER MATTER.
          </span>
        </div>

        <div className="ritual-function-copy">
          <span className="section-pill light-pill">
            FUNCTION
          </span>

          <h2>
            Add what your
            <br />
            <em>day needs.</em>
          </h2>

          <p>
            Function is optional, intentional and built around
            how you want to feel.
          </p>

          <div className="ritual-function-list">
            {functions.map((item, index) => (
              <div
                className="ritual-function-row"
                key={item}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item}</strong>

                <Check size={17} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* BRAND STATEMENT */}
      <section className="ritual-statement">
        <img
          src="/water-house-logo.svg"
          alt="Water House"
          className="ritual-statement-logo"
        />

        <span>MODERN HYDRATION RITUAL</span>

        <h2>
          Your water.
          <br />
          Your flavour.
          <br />
          <em>Your way.</em>
        </h2>

        <p>
          Freshly made, functional and personal.
        </p>

        <a href="/menu" className="ritual-statement-button">
          Build your water
          <ArrowRight size={17} />
        </a>
      </section>
    </main>
  );
}