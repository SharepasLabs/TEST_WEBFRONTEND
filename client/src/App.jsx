import { useEffect, useState, useRef } from 'react';
import './App.css';

/* ── Intersection Observer hook for reveal animations ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated background particles (lightweight) ── */
function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-icon">◆</span> Sherpa<span className="accent">Labs</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#mission">Mission</a>
          <a href="#build">What We Build</a>
          <a href="#values">Values</a>
          <a href="#contact" className="nav-cta">Get in Touch</a>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function HeroSection() {
  return (
    <section id="hero" className="hero">
      <ParticleField />
      <div className="hero-glow" />
      <div className="hero-content">
        <Reveal>
          <p className="hero-eyebrow">Innovation Lab</p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="hero-title">
            Sherpa<span className="accent">Labs</span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="hero-tagline">
            Building AI-powered innovation infrastructure —<br />
            intelligent systems that deploy, evolve, and scale.
          </p>
        </Reveal>
        <Reveal delay={500}>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Start Building</a>
            <a href="#about" className="btn btn-outline">Learn More</a>
          </div>
        </Reveal>
      </div>
      <div className="scroll-hint">
        <span className="scroll-line" />
      </div>
    </section>
  );
}

/* ── About ── */
function AboutSection() {
  const points = [
    'Guide through complexity, not just build solutions',
    'Combine experience, precision, and execution',
    'Focus on practical outcomes, not theoretical designs',
    'Operate with ownership from concept to deployment',
    'Enable others to reach higher ground faster',
  ];
  return (
    <section id="about" className="section about">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Who We Are</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">
            We don't just build technology. We guide founders and enterprises through the
            complexity of turning ideas into production-grade, self-sustaining systems.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="section-body">
            The <strong>Sherpa Mindset</strong> means we lead with experience, move with
            precision, and deliver with full ownership — from the first whiteboard session
            to the final deployment. We exist to help others reach higher ground, faster.
          </p>
        </Reveal>
        <div className="sherpa-grid">
          {points.map((p, i) => (
            <Reveal key={i} delay={300 + i * 80}>
              <div className="sherpa-card">
                <span className="sherpa-card-icon">◆</span>
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Mission & Vision ── */
function MissionSection() {
  return (
    <section id="mission" className="section mission">
      <div className="container">
        <div className="mission-grid">
          <Reveal>
            <div className="mission-card">
              <h3 className="mission-label">Mission</h3>
              <p className="mission-text">
                Create intelligent, <span className="accent">production-ready systems</span> that
                deploy rapidly, generate momentum, and continuously evolve through automation
                and structured execution.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="mission-card">
              <h3 className="mission-label">Vision</h3>
              <p className="mission-text">
                Become the <span className="accent">infrastructure layer</span> behind modern
                digital ventures—where AI, automation, and system design converge to create
                self-sustaining, scalable, and continuously evolving ecosystems.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── What We Build ── */
function BuildSection() {
  const capabilities = [
    {
      icon: '⚡',
      title: 'AI-Powered Automation Stacks',
      desc: 'Custom AI workflows, intelligent pipelines, and autonomous systems that reduce manual overhead and accelerate delivery.',
    },
    {
      icon: '🚀',
      title: 'Go-To-Market Systems',
      desc: 'End-to-end technology stacks designed for rapid deployment, real-world traction, and sustained growth velocity.',
    },
    {
      icon: '🧠',
      title: 'Intelligent Infrastructure',
      desc: 'Production-grade architecture that scales with your ambition — from first prototype to enterprise-grade deployment.',
    },
    {
      icon: '🔄',
      title: 'Self-Sustaining Ecosystems',
      desc: 'Systems that learn, adapt, and improve over time — building momentum through continuous automation and feedback loops.',
    },
    {
      icon: '🎯',
      title: 'Strategic Execution',
      desc: 'From concept to launch with full ownership. We don\'t hand off blueprints — we ship working solutions.',
    },
    {
      icon: '🔗',
      title: 'System Integration',
      desc: 'Seamlessly connect AI, data, and operational tools into a unified, centrally intelligent platform.',
    },
  ];
  return (
    <section id="build" className="section build">
      <div className="container">
        <Reveal>
          <h2 className="section-title">What We Build</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">
            Intelligence, automation, and execution — engineered for the real world.
          </p>
        </Reveal>
        <div className="build-grid">
          {capabilities.map((c, i) => (
            <Reveal key={i} delay={150 + i * 80}>
              <div className="build-card">
                <span className="build-card-icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Core Values ── */
function ValuesSection() {
  const values = [
    'Build for real-world execution, not prototypes',
    'Design systems for scale and continuity',
    'Prioritize clarity, structure, and precision',
    'Enable self-sustaining growth through automation',
    'Maintain centralized intelligence with decentralized execution',
  ];
  return (
    <section id="values" className="section values">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Core Values</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="section-subtitle">
            The principles that shape every system we design and every solution we ship.
          </p>
        </Reveal>
        <div className="values-grid">
          {values.map((v, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="value-card" style={{ '--index': i }}>
                <span className="value-number">0{i + 1}</span>
                <p>{v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact / CTA ── */
function ContactSection() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal>
          <div className="contact-inner">
            <h2 className="contact-title">Ready to Build?</h2>
            <p className="contact-text">
              Let's turn your vision into an intelligent, self-sustaining system
              that deploys fast, runs continuously, and scales without limits.
            </p>
            <a href="mailto:hello@sherpalabs.tech" className="btn btn-primary btn-lg">
              hello@sherpalabs.tech
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">◆</span> Sherpa<span className="accent">Labs</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} SherpaLabs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Root App ── */
function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <BuildSection />
      <ValuesSection />
      <ContactSection />
      <Footer />
    </>
  );
}

export default App;
