import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_FEEDBACK, FEEDBACK_CATEGORIES, getUnit } from "../mocks/data";
import "./FeedbackPage.css";

const SEVERITY_LABEL = {
  unusable: "Непридатний",
  limited: "Обмежено",
  minor: "Дрібне",
};

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function DonutChart({ segments, activeId, onSelect }) {
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  const cx = 120;
  const cy = 120;
  const r = 88;
  const stroke = 28;

  let angle = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.count / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { ...seg, start, end, pct: Math.round((seg.count / total) * 100) };
  });

  return (
    <svg viewBox="0 0 240 240" className="donut" role="img" aria-label="Розподіл проблем">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2e2e2e" strokeWidth={stroke} />
      {arcs.map((a) => (
        <path
          key={a.id}
          d={arcPath(cx, cy, r, a.start, a.end - 0.4)}
          fill="none"
          stroke={a.color}
          strokeWidth={activeId === a.id ? stroke + 4 : stroke}
          strokeLinecap="butt"
          className="donut-arc"
          onClick={() => onSelect(a.id)}
          style={{ cursor: "pointer", opacity: activeId && activeId !== a.id ? 0.45 : 1 }}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" className="donut-total">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="donut-sub">
        сигналів
      </text>
    </svg>
  );
}

export default function FeedbackPage() {
  const [active, setActive] = useState(null);
  const total = FEEDBACK_CATEGORIES.reduce((s, c) => s + c.count, 0);

  const activeCat = useMemo(
    () => FEEDBACK_CATEGORIES.find((c) => c.id === active) || null,
    [active],
  );

  return (
    <div className="fb">
      <header className="fb-head">
        <div>
          <p className="eyebrow">Відгуки з поля</p>
          <h1>Розподіл проблем за типом</h1>
          <p className="fb-lede">
            Коло показує, куди йде найбільше сигналів з PWA-форми — щоб R&amp;D
            бачив пріоритет, а не чат.
          </p>
        </div>
      </header>

      <div className="fb-layout">
        <section className="panel fb-chart-panel">
          <DonutChart
            segments={FEEDBACK_CATEGORIES}
            activeId={active}
            onSelect={(id) => setActive((prev) => (prev === id ? null : id))}
          />
          <p className="fb-chart-hint mono">
            {activeCat
              ? `${activeCat.label}: ${activeCat.count} · ${Math.round((activeCat.count / total) * 100)}%`
              : "Натисни сегмент для деталей"}
          </p>
        </section>

        <section className="panel fb-legend-panel">
          <p className="eyebrow">Категорії</p>
          <ul className="fb-cat-list">
            {FEEDBACK_CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`fb-cat${active === c.id ? " is-active" : ""}`}
                  onClick={() => setActive((prev) => (prev === c.id ? null : c.id))}
                >
                  <span className="fb-cat-swatch" style={{ background: c.color }} />
                  <span className="fb-cat-label">{c.label}</span>
                  <span className="fb-cat-count mono">{c.count}</span>
                  <span className="fb-cat-bar">
                    <i style={{ width: `${(c.count / total) * 100}%`, background: c.color }} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel">
        <p className="eyebrow">Останні звернення (мок)</p>
        <div className="fb-list">
          {DEMO_FEEDBACK.map((f) => {
            const unit = getUnit(f.serial);
            const cat = FEEDBACK_CATEGORIES.find((c) => c.id === f.category);
            return (
              <article key={f.id} className="fb-item">
                <div className="fb-item-top">
                  <Link className="mono" to="/app/tracking">
                    {f.serial}
                  </Link>
                  <span className="pill" style={{ borderColor: cat?.color, color: cat?.color }}>
                    {cat?.label || f.node}
                  </span>
                </div>
                <p className="fb-item-body">
                  <span className="mono">{f.symptom}</span>
                  {f.comment ? ` — ${f.comment}` : ""}
                  {" · "}
                  {SEVERITY_LABEL[f.severity]}
                </p>
                <div className="fb-item-meta">
                  <span>{new Date(f.ts).toLocaleString("uk-UA")}</span>
                  {unit && (
                    <Link to={`/app/quality?batch=${unit.batchId}`}>
                      Партія {unit.batchId} →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
