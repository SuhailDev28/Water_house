import { useEffect, useState } from "react";



import {

  ArrowRight,

  Play,

  Droplets,

  Sparkles,

  Leaf,

  Zap,

  MoveRight,

} from "lucide-react";



import { api } from "../services/api";



const benefits = [

  "Still water",



  "Sparkling water",



  "Coconut water",



  "Fresh flavours",



  "Electrolytes",



  "Magnesium",



  "Creatine",



  "Collagen",



  "Caffeine",



  "L-Theanine",

];



const ritualSteps = [

  {

    number: "01",



    kicker: "START WITH",



    title: ["Choose", "your water."],



    text: "Still, sparkling or coconut water. Choose the base and temperature that feels right.",



    className: "ritual-one",



    icon: Droplets,

  },



  {

    number: "02",



    kicker: "NEXT COMES",



    title: ["Add", "flavour."],



    text: "Fresh fruit, herbs and unexpected combinations shaped around your mood.",



    className: "ritual-two",



    icon: Leaf,

  },



  {

    number: "03",



    kicker: "MAKE IT WORK",



    title: ["Add", "function."],



    text: "Hydration, energy, focus, recovery and everyday wellbeing—only when you want it.",



    className: "ritual-three",



    icon: Zap,

  },

];



const flavourCards = [

  ["WHITE PEACH", "Soft + refreshing.", "flavour-peach"],



  ["STRAWBERRY SALT", "Sweet + mineral.", "flavour-strawberry"],



  ["YUZU MINT", "Citrus + bright.", "flavour-yuzu"],



  ["CUCUMBER LIME", "Clean + crisp.", "flavour-cucumber"],

];



const functions = [

  ["Electrolytes", "Hydrate deeper.", "function-peach", "01"],



  ["Magnesium", "Slow down. Reset.", "function-orange", "02"],



  ["Creatine", "Bring the power.", "function-leaf", "03"],



  ["Collagen", "Beauty from within.", "function-pink", "04"],



  ["Caffeine", "Wake your day.", "function-blue", "05"],



  ["L-Theanine", "Find your focus.", "function-cherry", "06"],

];



export default function Home() {

  const [page, setPage] = useState(null);



  useEffect(() => {

    api("/content/pages/home")

      .then(setPage)



      .catch(() => {});

  }, []);



  const heroSubtitle =

    page?.hero?.subtitle ||

    "Fresh flavour. Functional ingredients. Hydration made personal.";



  return (

    <main className="water-house-home">

      <section className="wh-hero wh-hero-v3">

        <div className="wh-hero-bg">

          <img src="/cafe.jpg" alt="Water House hydration experience" />

        </div>



        <div className="wh-hero-overlay" />



        <div className="hero-noise" />



        <div className="hero-glow hero-glow-one" />



        <div className="hero-glow hero-glow-two" />



        <div className="hero-v3-shell">

          <div className="hero-v3-main">

            <div className="hero-status">

              <span className="hero-status-dot" />



              <span>QATAR — COMING SOON</span>

            </div>



            <span className="pill-label hero-pill">

              MODERN HYDRATION RITUAL

            </span>



            <h1>

              Water,

              <br />

              <em>but reimagined.</em>

            </h1>



            <p className="hero-description">{heroSubtitle}</p>



            <div className="hero-simple-journey">

              <span>Choose water.</span>



              <span>Add flavour.</span>



              <span>Add function.</span>

            </div>



            <div className="hero-v3-actions">

              <a className="pill-button hero-primary-button" href="/menu">

                Build your water

                <ArrowRight size={16} />

              </a>



              <a

                className="pill-button hero-outline-button"

                href="/how-it-works"

              >

                Discover the ritual

              </a>

            </div>

          </div>



          <aside className="hero-ritual-panel">

            <div className="hero-ritual-heading">

              <span>YOUR WATER.</span>



              <span>YOUR WAY.</span>

            </div>



            <div className="hero-ritual-card">

              <div className="hero-ritual-step">

                <strong>01</strong>



                <div>

                  <small>BASE</small>



                  <h3>Still / Sparkling / Coconut</h3>

                </div>

              </div>



              <div className="hero-ritual-step">

                <strong>02</strong>



                <div>

                  <small>FLAVOUR</small>



                  <h3>Fresh fruit + botanicals</h3>

                </div>

              </div>



              <div className="hero-ritual-step">

                <strong>03</strong>



                <div>

                  <small>FUNCTION</small>



                  <h3>Hydrate / Focus / Energy</h3>

                </div>

              </div>

            </div>



            <a href="/how-it-works" className="hero-panel-link">

              See how it works

              <MoveRight size={19} />

            </a>

          </aside>

        </div>



        <a

          className="hero-film-v3"

          href="#ritual"

          aria-label="Explore the Water House ritual"

        >

          <span className="hero-film-circle">

            <Play size={17} fill="currentColor" />

          </span>



          <span>

            WATCH

            <strong>THE RITUAL</strong>

          </span>

        </a>



        <div className="hero-category-line">

          <span>HYDRATION</span>



          <i />



          <span>FLAVOUR</span>



          <i />



          <span>FUNCTION</span>



          <i />



          <span>COMMUNITY</span>

        </div>



        <a className="hero-scroll" href="#ritual">

          <span>SCROLL</span>



          <div />

        </a>

      </section>



      <section className="benefit-strip" aria-label="Water House highlights">

        <div className="benefit-track">

          {[...benefits, ...benefits].map((item, index) => (

            <span key={`${item}-${index}`}>{item}</span>

          ))}

        </div>

      </section>



      <section id="ritual" className="wh-intro section-wide">

        <span className="section-pill">THE RITUAL</span>



        <h2>

          Hydration starts

          <br />

          <em>with your choice.</em>

        </h2>



        <p>

          Water House is a meeting point between beverage, wellness, design and

          community. Start simple, then make it yours.

        </p>

      </section>



      <section className="ritual-grid section-gutter">

        {ritualSteps.map(

          ({ number, kicker, title, text, className, icon: Icon }) => (

            <article className={`ritual-card ${className}`} key={number}>

              <div className="ritual-card-top">

                <span className="ritual-number">{number}</span>



                <Icon className="ritual-icon" size={27} strokeWidth={1.4} />

              </div>



              <div className="ritual-card-copy">

                <small>{kicker}</small>



                <h3>

                  {title[0]}



                  <br />



                  {title[1]}

                </h3>



                <p>{text}</p>

              </div>

            </article>

          ),

        )}

      </section>



      <section className="flavour-editorial">

        <div className="flavour-heading">

          <span className="section-pill light-pill">FLAVOURS</span>



          <h2>

            Next comes

            <br />

            <em>flavour.</em>

          </h2>



          <p>

            Fresh.

            <br />

            Fruity.

            <br />

            Unexpected.

            <br />

            Yours.

          </p>

        </div>



        <div className="flavour-main-image">

          <img

            src="/flavours.jpg"

            alt="Water House flavoured hydration"

          />



          <span className="image-floating-label">NEXT COMES FLAVOUR</span>

        </div>



        <div className="flavour-stack">

          {flavourCards.map(([name, description, className]) => (

            <article className={`flavour-mini-card ${className}`} key={name}>

              <span>{name}</span>



              <strong>{description}</strong>



              <ArrowRight size={18} />

            </article>

          ))}



          <a href="/menu" className="editorial-arrow-link">

            <span>EXPLORE ALL FLAVOURS</span>



            <ArrowRight size={26} />

          </a>

        </div>

      </section>



      <section className="function-editorial section-wide">

        <div className="function-title">

          <span className="section-pill">FUNCTION</span>



          <h2>

            Your body knows.

            <br />

            <em>So does your water.</em>

          </h2>



          <p>Add only what your day calls for.</p>

        </div>



        <div className="function-masonry">

          {functions.map(([ingredient, name, className, number]) => (

            <article className={`function-card ${className}`} key={ingredient}>

              <div className="function-card-number">{number}</div>



              <div>

                <small>{ingredient}</small>



                <h3>{name}</h3>

              </div>

            </article>

          ))}



          <article className="function-photo-card">

            <img

              src="/functions.jpg"

              alt="Water House functional boosts"

            />



            <div className="function-photo-overlay">

              <Sparkles size={23} />



              <span>MAKE WATER MATTER.</span>

            </div>

          </article>

        </div>

      </section>



      <section className="brand-statement">

        <img

          className="brand-statement-logo"

          src="/water-house-logo.svg"

          alt="Water House"

        />



        <h2>

          Freshly made.

          <br />

          Functional.

          <br />

          <em>Personal.</em>

        </h2>



        <p>

          Not a juice bar. Not a supplement store. A new kind of hydration

          experience.

        </p>

      </section>



      <section className="lifestyle-grid section-gutter">

        <div className="lifestyle-image">

          <img

            src="/storefront.jpg"

            alt="Water House community and storefront"

          />



          <div className="lifestyle-image-label">

            A PLACE TO PAUSE.

            <br />

            MEET.

            <br />

            RETURN TO.

          </div>

        </div>



        <div className="lifestyle-copy">

          <span className="section-pill">THE SPIRIT</span>



          <h2>

            Good people.

            <br />

            <em>Brighter days.</em>

          </h2>



          <p>

            Water House is more than hydration. It is a daily ritual for feeling

            good, moving well and connecting with the people around you.

          </p>



          <a href="/about" className="editorial-arrow-link dark-link">

            <span>OUR STORY</span>



            <ArrowRight size={26} />

          </a>

        </div>

      </section>



      <section className="launch-section">

        <div className="launch-orb launch-orb-one" />



        <div className="launch-orb launch-orb-two" />



        <span className="launch-eyebrow">QATAR — COMING SOON</span>



        <h2>

          Your water.

          <br />

          <em>Your ritual.</em>

        </h2>



        <p>

          Join the Water House community for launch news, collaborations and

          first access.

        </p>



        <a href="/contact" className="pill-button launch-button">

          Stay connected

          <ArrowRight size={16} />

        </a>

      </section>

    </main>

  );

}
