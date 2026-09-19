import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ASSEMBLY_PARTS,
  ASSEMBLY_STATES,
  DRONES_DB,
} from "../mocks/data";
import "./AssemblerPages.css";

const STORAGE_KEY = "cherry_assembler_logs";

function loadLogs() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function AssemblerBenchPage() {
  const { user, setStation } = useAuth();
  const navigate = useNavigate();

  const [droneId, setDroneId] = useState(DRONES_DB[0]?.id || "");
  const [parts, setParts] = useState(() => new Set(["frame", "esc"]));
  const [stateId, setStateId] = useState("in_progress");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState(loadLogs);
  const [savedFlash, setSavedFlash] = useState(false);

  if (!user?.stationId) {
    return <Navigate to="/app/assembler/station" replace />;
  }

  const drone = useMemo(
    () => DRONES_DB.find((d) => d.id === droneId),
    [droneId],
  );

  function togglePart(id) {
    setParts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveEntry(e) {
    e.preventDefault();
    if (!drone) return;
    const state = ASSEMBLY_STATES.find((s) => s.id === stateId);
    const entry = {
      id: `log-${Date.now()}`,
      ts: new Date().toISOString(),
      stationId: user.stationId,
      stationLabel: user.stationLabel,
      operator: user.name,
      droneId: drone.id,
      serial: drone.serial,
      droneName: drone.name,
      parts: [...parts],
      stateId,
      stateLabel: state?.label,
      note: note.trim(),
    };
    const next = [entry, ...logs].slice(0, 40);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setLogs(next);
    setNote("");
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function changeStation() {
    setStation(null);
    navigate("/app/assembler/station");
  }

  const myLogs = logs.filter((l) => l.stationId === user.stationId);

  return (
    <div className="asm-page">
      <header className="asm-head">
        <div>
          <p className="eyebrow">Пункт · {user.stationLabel}</p>
          <h1>Верстак збиральника</h1>
          <p className="asm-lede">
            Відмітьте, що прикріпили до дрона і в якому він стані. Запис лишається
            в демо-журналі (sessionStorage).
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={changeStation}>
          Змінити пункт
        </button>
      </header>

      <form className="asm-bench panel" onSubmit={saveEntry}>
        <div className="asm-bench-grid">
          <div className="field">
            <label htmlFor="drone">Дрон</label>
            <select
              id="drone"
              value={droneId}
              onChange={(e) => setDroneId(e.target.value)}
            >
              {DRONES_DB.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.serial}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="state">Стан</label>
            <select
              id="state"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
            >
              {ASSEMBLY_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="asm-section-label">Прикріплено до дрона</p>
        <div className="asm-parts">
          {ASSEMBLY_PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`asm-part${parts.has(p.id) ? " is-on" : ""}`}
              onClick={() => togglePart(p.id)}
              aria-pressed={parts.has(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="field" style={{ marginTop: "1rem" }}>
          <label htmlFor="note">Коментар (опційно)</label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Напр.: ESC партія X-12"
          />
        </div>

        <div className="asm-actions">
          <button type="submit" className="btn btn-primary">
            Зберегти відмітку
          </button>
          {savedFlash && <span className="asm-flash mono">Збережено ✓</span>}
        </div>
      </form>

      <section className="panel asm-log">
        <p className="eyebrow">Журнал пункту {user.stationLabel}</p>
        {myLogs.length === 0 ? (
          <p className="asm-empty">Поки немає записів на цьому пункті.</p>
        ) : (
          <ul className="asm-log-list">
            {myLogs.map((l) => (
              <li key={l.id}>
                <div className="asm-log-top">
                  <span className="mono">{l.serial}</span>
                  <span className="pill pill-accent">{l.stateLabel}</span>
                </div>
                <p>
                  {l.droneName} ·{" "}
                  {l.parts
                    .map((id) => ASSEMBLY_PARTS.find((p) => p.id === id)?.label || id)
                    .join(", ")}
                </p>
                {l.note && <p className="asm-log-note">{l.note}</p>}
                <span className="asm-log-ts mono">
                  {new Date(l.ts).toLocaleString("uk-UA")} · {l.operator}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
