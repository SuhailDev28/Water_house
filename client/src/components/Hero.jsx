import { ArrowRight, Play, MoveRight } from "lucide-react";

export default function Hero({ content }) {
  const title = content?.title || "Water, but reimagined.";

  const subtitle =
    content?.subtitle ||
    "Fresh flavour. Functional ingredients. Hydration made personal.";

  return (
    <section className="hero-premium">
      {/* BACKGROUND */}
      <div className="hero-premium-bg">
        <img
          src="/cafe.jpg"
          alt="Water House hydration experience"
        />
      </div>

      <div className="hero-premium-overlay" />

      <div className="hero-premium-glow hero-glow-a" />
      <div className="hero-premium-glow hero-glow-b" />

      {/* CONTENT */}
      <div className="hero-premium-inner">
        <div className="hero-premium-copy">
          <div className="hero-launch-status">
            <span />
            QATAR — COMING SOON
          </div>

          <img
            src="/water-house-logo.svg"
            alt="Water House"
            className="hero-premium-logo"
          />

          <div className="hero-premium-label">
            MODERN HYDRATION RITUAL
          </div>

          <h1>
            {title === "Water, but reimagined." ? (
              <>
                Water,
                <br />
                <em>but reimagined.</em>
              </>
            ) : (
              title
            )}
          </h1>

          <p>{subtitle}</p>

          <div className="hero-premium-steps">
            <span>Choose water</span>
            <i />
            <span>Add flavour</span>
            <i />
            <span>Add function</span>
          </div>

          <div className="hero-premium-actions">
            <a
              className="hero-button hero-button-primary"
              href="/menu"
            >
              Build your water
              <ArrowRight size={16} />
            </a>

            <a
              className="hero-button hero-button-secondary"
              href="/how-it-works"
            >
              Discover the ritual
            </a>
          </div>
        </div>

        {/* RITUAL PANEL */}
        <aside className="hero-premium-panel">
          <div className="hero-panel-top">
            <span>YOUR WATER.</span>
            <span>YOUR WAY.</span>
          </div>

          <div className="hero-panel-card">
            <div className="hero-panel-step">
              <span className="hero-panel-number">01</span>

              <div>
                <small>BASE</small>
                <strong>
                  Still / Sparkling / Coconut
                </strong>
              </div>
            </div>

            <div className="hero-panel-step">
              <span className="hero-panel-number">02</span>

              <div>
                <small>FLAVOUR</small>
                <strong>
                  Fresh fruit + botanicals
                </strong>
              </div>
            </div>

            <div className="hero-panel-step">
              <span className="hero-panel-number">03</span>

              <div>
                <small>FUNCTION</small>
                <strong>
                  Hydrate / Focus / Energy
                </strong>
              </div>
            </div>
          </div>

          <a
            className="hero-panel-link"
            href="/how-it-works"
          >
            See how it works
            <MoveRight size={18} />
          </a>
        </aside>
      </div>

      {/* BOTTOM */}
      <a
        className="hero-watch"
        href="#ritual"
      >
        <span className="hero-watch-icon">
          <Play size={17} fill="currentColor" />
        </span>

        <span>
          WATCH
          <strong>THE RITUAL</strong>
        </span>
      </a>

      <div className="hero-premium-categories">
        <span>HYDRATION</span>
        <i />
        <span>FLAVOUR</span>
        <i />
        <span>FUNCTION</span>
        <i />
        <span>COMMUNITY</span>
      </div>

      <a
        href="#ritual"
        className="hero-premium-scroll"
      >
        <span>SCROLL</span>
        <i />
      </a>
    </section>
  );
}