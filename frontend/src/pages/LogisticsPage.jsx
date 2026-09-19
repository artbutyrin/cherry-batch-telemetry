import { Link } from "react-router-dom";
import { DRONES_DB, getSite } from "../mocks/data";
import "./AssemblerPages.css";

export default function LogisticsPage() {
  return (
    <div className="asm-page logi-page">
      <header className="asm-head">
        <div>
          <p className="eyebrow">Адмін Інженер R&amp;D · логістика</p>
          <h1>Куди рухається виріб</h1>
          <p className="asm-lede">
            Маршрути з міні-БД: етапи збірки й логістики між демо-зонами. Для карти
            з pulse-маркерами — розділ трекінгу.
          </p>
        </div>
        <Link className="btn btn-primary" to="/app/tracking">
          Відкрити карту
        </Link>
      </header>

      <div className="logi-grid">
        {DRONES_DB.map((drone) => (
          <article key={drone.id} className="panel logi-card">
            <div className="logi-card-top">
              <div>
                <h2 className="mono">{drone.name}</h2>
                <p className="mono logi-serial">{drone.serial}</p>
              </div>
              <span className="pill" style={{ borderColor: drone.color, color: drone.color }}>
                {drone.status}
              </span>
            </div>

            <ol className="logi-route">
              {drone.waypoints.map((wp, i) => {
                const site = getSite(wp.siteId);
                const isLast = i === drone.waypoints.length - 1;
                return (
                  <li key={wp.id} className={isLast ? "is-current" : ""}>
                    <span className="logi-dot" style={{ background: drone.color }} />
                    <div>
                      <strong>{wp.label}</strong>
                      <p>
                        {wp.stage} · {site?.near || wp.siteId}
                      </p>
                    </div>
                    {!isLast && <span className="logi-arrow" aria-hidden>↓</span>}
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
