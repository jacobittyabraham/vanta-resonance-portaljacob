"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";
import SignalChat from "./SignalChat";

gsap.registerPlugin(ScrollTrigger);

export default function VantaExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.08 });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 55, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".draw-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.to(".hero-orb", {
        yPercent: -12,
        xPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-character", {
        yPercent: -8,
        rotationY: 3,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-word", {
        letterSpacing: "0.18em",
        opacity: 0.45,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".origin-art", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: ".origin",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".scan-beam", {
        xPercent: 115,
        ease: "none",
        scrollTrigger: {
          trigger: ".powers",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    const onPointer = (event: PointerEvent) => {
      setCursor({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("pointermove", onPointer);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("chat-open", chatOpen);
    return () => document.body.classList.remove("chat-open");
  }, [chatOpen]);

  const scrollToSignal = () => {
    setChatOpen(true);
    setMenuOpen(false);
  };

  return (
    <main ref={root} className="site">
      <div className="noise" aria-hidden="true" />
      <div
        className="ambient-cursor"
        style={{
          transform: `translate3d(${cursor.x * 30}px, ${cursor.y * 30}px, 0)`,
        }}
        aria-hidden="true"
      />

      <header className="nav">
        <a href="#" className="nav-brand" aria-label="Vanta home"><AnimatedLogo compact /></a>
        <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <a href="#origin" onClick={() => setMenuOpen(false)}>Origin</a>
          <a href="#powers" onClick={() => setMenuOpen(false)}>Resonance</a>
          <a href="#network" onClick={() => setMenuOpen(false)}>Network</a>
          <button onClick={scrollToSignal}>Ask Vanta <ArrowRight size={15} /></button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-signal" aria-hidden="true">
          <span>LAT 10.00° N</span><span>LONG 76.28° E</span><span>RESONANCE ACTIVE</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow reveal">SIGNAL DETECTED / 01</p>
          <h1 className="hero-word">
            VANTA<span className="hero-dot">.</span>
          </h1>
          <p className="hero-sub reveal">
            The signal between people.
          </p>
          <p className="hero-description reveal">
            When the world gets loud, Vanta listens. A fictional guardian built
            to turn unheard signals into action.
          </p>
          <button className="button button--primary reveal" onClick={scrollToSignal}>
            <span>ENTER THE SIGNAL</span><ArrowRight size={16} />
          </button>
        </div>

        <div
          className="hero-visual"
          style={{
            transform: `perspective(1200px) rotateX(${cursor.y * -2}deg) rotateY(${cursor.x * 3}deg)`,
          }}
        >
          <div className="hero-orb" />
          <div className="hero-rings" aria-hidden="true">
            <i /><i /><i />
          </div>
          <div className="hero-character">
            <div className="character-head" />
            <div className="character-body">
              <div className="character-chest" />
              <div className="character-arm character-arm--left" />
              <div className="character-arm character-arm--right" />
            </div>
            <div className="character-cape" />
          </div>
          <div className="hero-hud hero-hud--top">RESONANCE / 98.7%</div>
          <div className="hero-hud hero-hud--bottom">STATUS / LISTENING</div>
        </div>

        <div className="scroll-cue"><ArrowDown size={15} /> SCROLL TO TRANSMIT</div>
      </section>

      <section className="statement section-dark">
        <div className="section-index">02 / SIGNAL</div>
        <div className="statement-inner">
          <p className="eyebrow reveal">THE WORLD IS LOUD.</p>
          <h2 className="mega reveal">VANTA<br /><span>LISTENS.</span></h2>
          <div className="draw-line" />
          <p className="statement-copy reveal">
            Some emergencies never become headlines. Some people never ask twice.
            Vanta was created for the space between a problem and the courage to say it out loud.
          </p>
        </div>
      </section>

      <section className="origin section" id="origin">
        <div className="section-index">03 / ORIGIN</div>
        <div className="origin-layout">
          <div className="origin-copy">
            <p className="eyebrow reveal">THE ORIGIN STORY</p>
            <h2 className="display reveal">I wasn't<br /><em>born</em> a hero.</h2>
            <p className="body-large reveal">
              Before the suit, there was a signal. A strange frequency hidden
              beneath the noise of the city — fear, isolation, injustice,
              people asking for help in places nobody was listening.
            </p>
            <p className="body-large reveal">
              Vanta learned to hear it. Then he built a system around it.
            </p>
          </div>
          <div className="origin-art" aria-label="Abstract Vanta origin artwork">
            <div className="origin-sphere" />
            <div className="origin-crosshair" />
            <div className="origin-label">ORIGIN / UNKNOWN</div>
            <div className="origin-coordinate">10°00' N / 76°28' E</div>
          </div>
        </div>
      </section>

      <section className="powers section-dark" id="powers">
        <div className="section-index">04 / RESONANCE</div>
        <div className="powers-header">
          <p className="eyebrow reveal">THREE WAYS TO HEAR</p>
          <h2 className="display reveal">THE POWER<br /><em>IS LISTENING.</em></h2>
        </div>
        <div className="scan-stage" aria-hidden="true"><div className="scan-beam" /></div>
        <div className="power-list">
          {[
            ["01", "SIGNAL SIGHT", "Perceives distress hidden inside ordinary noise.", "◌"],
            ["02", "ECHO MEMORY", "Reconstructs the shape of what happened — without judgment.", "⌁"],
            ["03", "RESONANCE", "Connects a person to the next action that can actually help.", "◎"],
          ].map(([num, title, copy, icon]) => (
            <article className="power-card reveal" key={num}>
              <div className="power-card__num">{num}</div>
              <div className="power-card__icon">{icon}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="power-card__line" />
            </article>
          ))}
        </div>
      </section>

      <section className="mission section" id="mission">
        <div className="section-index">05 / MISSION</div>
        <div className="mission-wrap">
          <p className="eyebrow reveal">THE VANTA DIRECTIVE</p>
          <h2 className="mega reveal">
            NO ONE<br />
            SHOULD HAVE<br />
            TO <span>SHOUT.</span>
          </h2>
          <p className="mission-copy reveal">
            The portal exists to make asking for help feel human. No cold forms.
            No maze of menus. Just a conversation, a signal, and a response.
          </p>
        </div>
      </section>

      <section className="network section-dark" id="network">
        <div className="section-index">06 / NETWORK</div>
        <div className="network-header">
          <p className="eyebrow reveal">LIVE SIGNAL FIELD</p>
          <h2 className="display reveal">YOU ARE<br /><em>NOT ALONE.</em></h2>
        </div>
        <div className="network-field" aria-label="Decorative signal network">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={`network-node node-${i + 1}`}
              style={{ animationDelay: `${i * -0.4}s` }}
            />
          ))}
          <div className="network-center">V</div>
          <svg className="network-lines" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M500 250 L130 100 L60 390" />
            <path d="M500 250 L820 80 L930 350" />
            <path d="M500 250 L270 430 L740 440" />
            <path d="M500 250 L550 60 L360 70" />
          </svg>
          <div className="network-caption">ANONYMOUS SIGNALS / LIVE VISUALIZATION</div>
        </div>
      </section>

      <section className="cta section">
        <div className="section-index">07 / CONTACT</div>
        <div className="cta-inner">
          <p className="eyebrow reveal">A SIGNAL IS ALL IT TAKES</p>
          <h2 className="mega reveal">TELL<br /><span>VANTA.</span></h2>
          <p className="cta-copy reveal">You don't need the right words. Start with what happened.</p>
          <button className="button button--primary button--large reveal" onClick={scrollToSignal}>
            <span>ASK FOR HELP</span><ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer className="footer">
        <AnimatedLogo />
        <div>
          <p>VANTA / RESONANCE NETWORK</p>
          <span>FICTIONAL CHARACTER / INTERACTIVE EXPERIENCE</span>
        </div>
        <span>© 2026</span>
      </footer>

      {chatOpen && (
        <div className="chat-overlay" role="dialog" aria-modal="true" aria-label="Talk to Vanta">
          <button className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat"><X /></button>
          <div className="chat-backdrop" />
          <div className="chat-shell">
            <div className="chat-hero">
              <AnimatedLogo />
              <p className="eyebrow">SECURE CONVERSATIONAL CHANNEL</p>
              <h2>I'm listening.</h2>
              <p>No forms. No judgment. Just tell me what you need.</p>
            </div>
            <SignalChat onClose={() => setChatOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
}