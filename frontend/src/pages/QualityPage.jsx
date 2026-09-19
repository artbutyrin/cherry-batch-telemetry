import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  DEMO_FEEDBACK,
  DEMO_UNITS,
  feedbackForSerial,
  getBatchSiblings,
  getBuildParts,
  getDrone,
  getManufacturer,
  getSite,
  getUnit,
} from "../mocks/data";
import "./QualityPage.css";

const STATUS_LABEL = {
  assembled: "Зібрано",
  in_progress: "На лінії",
  in_transit: "У логістиці",
};

export default function QualityPage() {
  const [params] = useSearchParams();
  const serialParam = params.get("serial");
  const focusDrone = serialParam ? getDrone(serialParam) : null;
  const batchId = params.get("batch") || focusDrone?.batchId || "B-12";
  const maker = focusDrone ? getManufacturer(focusDrone) : null;

  const siblings = useMemo(() => getBatchSiblings(batchId), [batchId]);
  const batches = useMemo(
    () => [...new Set(DEMO_UNITS.map((u) => u.batchId))],
    [],
  );

  const feedbackOnBatch = useMemo(() => {
    const serials = new Set(siblings.map((s) => s.serial));
    return DEMO_FEEDBACK.filter((f) => serials.has(f.serial));
  }, [siblings]);

  const sharedSymptom = useMemo(() => {
    const counts = {};
    for (const f of feedbackOnBatch) {
      const key = `${f.node}:${f.symptom}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
  }, [feedbackOnBatch]);

  const sharedComponents = useMemo(() => {
    if (!siblings.length) return [];
    return siblings[0].components.filter((c) =>
      siblings.every((s) => s.components.includes(c)),
    );
  }, [siblings]);

  const focusFeedback = focusDrone ? feedbackForSerial(focusDrone.serial) : [];
  const focusParts = focusDrone ? getBuildParts(focusDrone) : [];

  return (
    <div className="qual">
      <header className="qual-head">
        <div>
          <p className="eyebrow">Якість партій · напрям 1 ↔ 2</p>
          <h1>Локалізація за партією</h1>
          <p className="qual-lede">
            Відгук з поля + паспорт збірки: усі серійники партії, виробник і
            спільний компонент/симптом — без пошуку в чатах.
          </p>
        </div>
        <div className="qual-batch-switch">
          {batches.map((b) => (
            <Link
              key={b}
              to={`/app/quality?batch=${b}`}
              className={`btn ${b === batchId ? "btn-primary" : "btn-ghost"}`}
            >
              {b}
            </Link>
          ))}
        </div>
      </header>

      {focusDrone && maker && (
        <section className="panel qual-passport">
          <div className="qual-passport-head">
            <div>
              <p className="eyebrow">Паспорт виробу</p>
              <h2 className="mono">{focusDrone.serial}</h2>
              <p className="qual-passport-sub">
                {focusDrone.name} · {focusDrone.model}
              </p>
            </div>
            <Link className="btn btn-ghost" to="/app/tracking">
              ← До трекінгу
            </Link>
          </div>

          <div className="qual-passport-grid">
            <div>
              <p className="eyebrow">Виробник</p>
              <p className="qual-big">{maker.name}</p>
              <p className="qual-muted mono">{maker.code}</p>
            </div>
            <div>
              <p className="eyebrow">Лінія збірки</p>
              <p className="qual-big">{maker.line}</p>
              <p className="qual-muted">{maker.site}</p>
            </div>
            <div>
              <p className="eyebrow">BOM / QA</p>
              <p className="qual-big mono">{maker.bom}</p>
              <p className="qual-muted">{maker.qaLead}</p>
            </div>
            <div>
              <p className="eyebrow">Статус</p>
              <p className="qual-big hi">{STATUS_LABEL[focusDrone.status]}</p>
              <p className="qual-muted">{maker.assembledLabel}</p>
            </div>
          </div>

          <div className="qual-passport-route">
            <p className="eyebrow">Етапи збірки / логістики</p>
            <ol className="qual-steps">
              {focusDrone.waypoints.map((wp) => (
                <li key={wp.id}>
                  <strong>{wp.label}</strong>
                  <span>
                    {wp.stage} · {getSite(wp.siteId)?.near}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="qual-parts">
            <p className="eyebrow">Деталі виготовлення (BOM)</p>
            <p className="qual-parts-lede">
              Комплектуючі, з яких зібрано цей серійник — постачальник і лот
              (демо-дані).
            </p>
            <div className="qual-table-wrap">
              <table className="qual-table qual-parts-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Деталь</th>
                    <th>Постачальник</th>
                    <th>Лот</th>
                    <th>Rev</th>
                  </tr>
                </thead>
                <tbody>
                  {focusParts.map((p) => (
                    <tr key={p.sku}>
                      <td className="mono">{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.supplier}</td>
                      <td className="mono">{p.lot}</td>
                      <td className="mono">{p.rev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {focusFeedback.length > 0 && (
            <div className="qual-passport-fb">
              <p className="eyebrow">Сигнали з поля по цьому серійнику</p>
              <ul className="qual-fb-list">
                {focusFeedback.map((f) => (
                  <li key={f.id}>
                    <span className="mono">{f.category}</span>
                    <span>{f.comment}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="qual-summary panel">
        <div>
          <p className="eyebrow">Партія</p>
          <p className="qual-big mono">{batchId}</p>
        </div>
        <div>
          <p className="eyebrow">Виробів у партії</p>
          <p className="qual-big mono">{siblings.length}</p>
        </div>
        <div>
          <p className="eyebrow">Відгуків</p>
          <p className="qual-big mono">{feedbackOnBatch.length}</p>
        </div>
        <div>
          <p className="eyebrow">Повторюваний сигнал</p>
          <p className="qual-big mono">
            {sharedSymptom
              ? `${sharedSymptom[0]} ×${sharedSymptom[1]}`
              : "немає"}
          </p>
        </div>
      </section>

      {sharedComponents.length > 0 && (
        <div className="banner-demo">
          Спільні компоненти партії:{" "}
          <strong>{sharedComponents.join(", ")}</strong>
          {sharedSymptom && sharedSymptom[1] >= 2
            ? " — кандидат на перевірку R&D (мок-висновок)."
            : "."}
        </div>
      )}

      <section className="panel">
        <p className="eyebrow">Серійники партії</p>
        <div className="qual-table-wrap">
          <table className="qual-table">
            <thead>
              <tr>
                <th>Серійник</th>
                <th>Демо-зона</th>
                <th>Етап</th>
                <th>BOM (деталі)</th>
                <th>Відгуки</th>
              </tr>
            </thead>
            <tbody>
              {siblings.map((u) => {
                const site = getSite(u.siteId);
                const fb = feedbackForSerial(u.serial);
                const isFocus = focusDrone?.serial === u.serial;
                const partCount = u.parts?.length || u.components?.length || 0;
                return (
                  <tr key={u.serial} className={isFocus ? "is-focus" : undefined}>
                    <td className="mono">
                      <Link to={`/app/quality?batch=${batchId}&serial=${u.serial}`}>
                        {u.serial}
                      </Link>
                    </td>
                    <td>{site?.near}</td>
                    <td>{u.stage}</td>
                    <td>
                      <Link
                        className="mono"
                        to={`/app/quality?batch=${batchId}&serial=${u.serial}`}
                      >
                        {partCount} поз.
                      </Link>
                    </td>
                    <td>{fb.length ? `${fb.length} сигнал(и)` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!focusDrone && siblings[0] && (
          <p className="qual-hint">
            Обери серійник, щоб побачити повний перелік деталей виготовлення.
          </p>
        )}
      </section>

      {!siblings.length && (
        <p className="dim">
          Партію не знайдено. Приклад:{" "}
          {getUnit("A7K-2941")?.batchId || "B-12"}
        </p>
      )}
    </div>
  );
}
