import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SplitFlapText from "../components/SplitFlapText";
import ScrambledText from "../components/ScrambledText";
import CardSwap, { Card } from "../components/CardSwap";
import { Reveal } from "../components/Reveal";
import Crosshair from "../components/Crosshair";
import { DRONES_DB, homeStatusSamples } from "../mocks/data";
import "./HomePage.css";

const LINE_1 = "Інформація рухається";
const LINE_2 = "швидше за виробництво";

export default function HomePage() {
  const crosshairZoneRef = useRef(null);

  useEffect(() => {
    const main = document.querySelector(".shell-main");
    if (!main) return;
    main.scrollTop = 0;
  }, []);

  return (
    <div className="home-bleed">
      <section className="home-hero-full" id="home-top">
        <img className="home-hero-gif" src="/media/promo.gif" alt="" aria-hidden />
        <div className="home-hero-veil" />
        <div className="home-hero-scan" aria-hidden />

        <div className="home-hero-content">
          <p className="eyebrow home-hero-eyebrow">General Cherry · Keep Shipping</p>

          <h1 className="home-headline" aria-label={`${LINE_1} ${LINE_2}`}>
            <SplitFlapText
              words={[LINE_1, LINE_1]}
              forceReflip
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={3200}
              charset="uk"
              flipsPerChar={5}
              tileColor="#120F17"
              textColor="#f8fafc"
              tileRadius={5}
              gap={3}
              fontSize={32}
              loop
              padTo={LINE_1.length}
              className="home-split"
            />
            <SplitFlapText
              words={[LINE_2, LINE_2]}
              forceReflip
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={3200}
              charset="uk"
              flipsPerChar={5}
              tileColor="#120F17"
              textColor="#f8fafc"
              tileRadius={5}
              gap={3}
              fontSize={32}
              loop
              padTo={LINE_2.length}
              className="home-split"
            />
          </h1>

          <p className="home-lede">
            Кабінет звʼязує збірку на майданчиках і структурований відгук з поля —
            щоб R&amp;D бачив партію, а не чат.
          </p>
          <div className="home-cta">
            <Link className="btn btn-primary home-cta-track" to="/app/tracking">
              <ScrambledText
                className="home-scramble"
                radius={90}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
              >
                Відкрити трекінг
              </ScrambledText>
            </Link>
            <Link className="btn btn-ghost home-cta-ghost" to="/app/feedback">
              Відгуки з поля
            </Link>
          </div>
        </div>

        <div className="home-hero-status">
          <span>Keep Shipping</span>
          <span className="home-hero-status-mid">Демо-зони · не реальні адреси</span>
          <span>Scroll to explore ↓</span>
        </div>
      </section>

      {/* Crosshair zone: about + band (after hero video) */}
      <div className="home-crosshair-zone" ref={crosshairZoneRef}>
        <Crosshair containerRef={crosshairZoneRef} color="#ffffff" />

        <section className="home-about">
          <div className="home-shell home-about-grid">
            <Reveal className="home-about-aside">
              <p className="eyebrow">Система</p>
              <p className="home-about-aside-text">
                Один серійник — міст між цехом і полем. Трекінг збірки + відгуки з
                PWA-форми.
              </p>
            </Reveal>
            <div className="home-about-main">
              <Reveal delay={80}>
                <h2 className="home-about-title">
                  Ми зʼєднуємо{" "}
                  <span className="home-muted">
                    виробництво, якість і сигнал з підрозділів
                  </span>{" "}
                  в один потік даних.
                </h2>
              </Reveal>
              <Reveal delay={160} className="home-about-footer">
                <Link className="btn btn-ghost" to="/app/tracking">
                  Дивитись трекінг →
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="home-band">
          <div className="home-shell home-band-layout">
            <Reveal className="home-band-copy">
              <p className="eyebrow">Keep Shipping</p>
              <h2 className="home-band-title">Ми Тримаємо Темп</h2>
              <p className="home-band-lede">
                Три слова — один ритм: збирати, перевіряти, відвантажувати без
                розриву між цехом і полем.
              </p>
            </Reveal>
            <div className="home-band-stage">
              <CardSwap
                width={600}
                height={440}
                cardDistance={75}
                verticalDistance={85}
                delay={1600}
                pauseOnHover
                skewAmount={5}
                easing="power"
              >
                <Card className="home-swap-card">
                  <span className="home-swap-kicker">01</span>
                  <h3>Ми</h3>
                  <p>Один серійник на виріб — спільна правда для збірки і R&amp;D.</p>
                </Card>
                <Card className="home-swap-card">
                  <span className="home-swap-kicker">02</span>
                  <h3>Тримаємо</h3>
                  <p>Маршрут, QA і відгук з поля в одному потоці без чату.</p>
                </Card>
                <Card className="home-swap-card">
                  <span className="home-swap-kicker">03</span>
                  <h3>Темп</h3>
                  <p>Швидкість інформації = швидкість випуску партії.</p>
                </Card>
              </CardSwap>
            </div>
          </div>
        </section>
      </div>

      <section className="home-portfolio">
        <div className="home-shell">
          <Reveal className="home-portfolio-head">
            <h2>Три вироби в демо-потоці</h2>
          </Reveal>
          <ul className="home-portfolio-grid">
            {homeStatusSamples().map((d, i) => (
              <Reveal key={d.id} as="li" delay={i * 90}>
                <Link
                  className="home-drone-card"
                  to={`/app/tracking?status=${d.status}`}
                >
                  <h3 className="mono">{d.name}</h3>
                  <p className="home-drone-desc">
                    {d.waypoints.length} точок маршруту ·{" "}
                    {d.waypoints.map((w) => w.label).join(" → ")}
                  </p>
                  <div className="home-drone-tags">
                    {d.waypoints.map((w) => (
                      <span key={w.id} className="home-tag">
                        {w.stage}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-services">
        <div className="home-shell">
          <Reveal>
            <p className="eyebrow">Модулі</p>
            <h2 className="home-services-title">Що вже в кабінеті</h2>
          </Reveal>
          <ul className="home-services-list">
            {[
              {
                n: "01",
                title: "Трекінг збірки",
                desc: "Карта, маршрути, демо-зони Львова / Луцька / Чернігова / EU.",
                to: "/app/tracking",
              },
              {
                n: "02",
                title: "Відгуки з поля",
                desc: "Donut проблем: мотори, лопаті, живлення — сигнал для R&D.",
                to: "/app/feedback",
              },
              {
                n: "03",
                title: "Якість партій",
                desc: "Локалізація siblings за партією за хвилину.",
                to: "/app/quality",
              },
            ].map((row, i) => (
              <Reveal key={row.n} as="li" delay={i * 80}>
                <Link className="home-service-row" to={row.to}>
                  <span className="mono">{row.n}</span>
                  <h3>{row.title}</h3>
                  <p>{row.desc}</p>
                  <span className="home-service-go" aria-hidden>
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-shell">
          <Reveal className="home-stats-panel">
            <p className="eyebrow home-stats-eyebrow">Цифри демо</p>
            <h2>Швидкість інформації — це і є випуск.</h2>
            <ul className="home-stats-grid">
              <li>
                <strong>{DRONES_DB.length}</strong>
                <span>дрони в БД</span>
              </li>
              <li>
                <strong>4</strong>
                <span>демо-зони</span>
              </li>
              <li>
                <strong>26</strong>
                <span>сигналів (мок)</span>
              </li>
              <li>
                <strong>&lt;1хв</strong>
                <span>до партії</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-shell home-footer-inner">
          <Reveal>
            <h2>
              Є сигнал з поля?
              <br />
              Відкрий трекінг.
            </h2>
            <Link className="btn btn-primary" to="/app/tracking">
              До карти збірки
            </Link>
          </Reveal>
          <p className="home-footer-copy mono">
            © Cherry Trace · General Cherry · Keep Shipping
          </p>
        </div>
      </footer>
    </div>
  );
}
