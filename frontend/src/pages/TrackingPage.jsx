import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  DEMO_SITES,
  DEMO_UNITS,
  DRONES_DB,
  STATUS_FILTERS,
  dronesByStatus,
  getManufacturer,
  getSite,
  routeLatLngs,
  unitsAtSite,
} from "../mocks/data";
import "./TrackingPage.css";

const STATUS_LABEL = {
  assembled: "Зібрано",
  in_progress: "На лінії",
  in_transit: "У логістиці",
};

const STATUS_COLOR = {
  assembled: "#ff3358",
  in_progress: "#ff8da1",
  in_transit: "#c9c9c9",
};

function markerHtml(color, delayMs) {
  return `
    <div style="
      width:12px;height:12px;border-radius:50%;
      background:${color};box-shadow:0 0 8px ${color};position:relative;
    ">
      <div style="
        position:absolute;inset:-3px;border-radius:50%;
        border:1.5px solid ${color};opacity:0.6;
        animation:pulse-ring 2.6s ease-out infinite;
        animation-delay:${delayMs}ms;
      "></div>
    </div>`;
}

export default function TrackingPage() {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [coords, setCoords] = useState({ lat: "—", lon: "—" });
  const [serialQuery, setSerialQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [sitePeek, setSitePeek] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const stats = useMemo(() => {
    const total = DEMO_UNITS.length;
    const assembled = DEMO_UNITS.filter((u) => u.status === "assembled").length;
    const onLine = DEMO_UNITS.filter((u) => u.status === "in_progress").length;
    return { total, assembled, onLine, sites: DEMO_SITES.length };
  }, []);

  const statusList = useMemo(
    () => (activeStatus ? dronesByStatus(activeStatus) : []),
    [activeStatus],
  );

  const panelOpen = Boolean(activeStatus || selectedDrone || sitePeek);

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([50.1, 27.2], 6);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    map.on("mousemove", (e) => {
      setCoords({
        lat: e.latlng.lat.toFixed(5),
        lon: e.latlng.lng.toFixed(5),
      });
    });
    map.on("mouseout", () => setCoords({ lat: "—", lon: "—" }));

    DEMO_SITES.forEach((site, i) => {
      const units = unitsAtSite(site.id);
      const dominant =
        units.find((u) => u.status === "in_progress")?.status ||
        units[0]?.status ||
        "assembled";
      const color = STATUS_COLOR[dominant] || "#ff3358";

      const icon = L.divIcon({
        className: "track-marker",
        html: markerHtml(color, i * 220),
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([site.lat, site.lon], { icon }).addTo(map);
      marker.on("click", () => {
        setSelectedDrone(null);
        setActiveStatus(null);
        setSitePeek({ site, units });
        map.flyTo([site.lat, site.lon], Math.max(map.getZoom(), 8), {
          duration: 0.85,
        });
      });
    });

    DRONES_DB.forEach((drone) => {
      L.polyline(routeLatLngs(drone), {
        color: drone.color,
        weight: 2.5,
        opacity: 0.55,
        dashArray: "8 10",
      }).addTo(map);

      drone.waypoints.forEach((wp) => {
        L.circleMarker([wp.lat, wp.lon], {
          radius: 4,
          color: drone.color,
          weight: 2,
          fillColor: "#120F17",
          fillOpacity: 0.9,
        })
          .bindTooltip(`${drone.serial} · ${wp.label}`, { direction: "top" })
          .addTo(map);
      });
    });

    mapObj.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapObj.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const raw = (searchParams.get("status") || "").toLowerCase();
    if (!raw) return;
    const match = STATUS_FILTERS.find(
      (s) => s.id === raw || s.label.toLowerCase() === raw,
    );
    if (!match) return;

    setSitePeek(null);
    setSelectedDrone(null);
    setActiveStatus(match.id);

    const drones = dronesByStatus(match.id);
    if (!mapObj.current || drones.length === 0) return;
    const bounds = L.latLngBounds([]);
    drones.forEach((d) => {
      routeLatLngs(d).forEach((ll) => bounds.extend(ll));
    });
    if (bounds.isValid()) {
      mapObj.current.fitBounds(bounds.pad(0.35));
    }
  }, [mapReady, searchParams]);

  function closePanel() {
    setSelectedDrone(null);
    setActiveStatus(null);
    setSitePeek(null);
  }

  function openStatus(statusId) {
    setSitePeek(null);
    setSelectedDrone(null);
    setActiveStatus(statusId);
    const next = new URLSearchParams(searchParams);
    if (next.get("status") !== statusId) {
      next.set("status", statusId);
      setSearchParams(next, { replace: true });
    }
    const drones = dronesByStatus(statusId);
    if (!mapObj.current || drones.length === 0) return;
    const bounds = L.latLngBounds([]);
    drones.forEach((d) => {
      routeLatLngs(d).forEach((ll) => bounds.extend(ll));
    });
    if (bounds.isValid()) {
      mapObj.current.fitBounds(bounds.pad(0.35));
    }
  }

  function openDrone(drone) {
    if (!drone || !mapObj.current) return;
    setSitePeek(null);
    setActiveStatus(drone.status);
    setSelectedDrone(drone);
    mapObj.current.fitBounds(L.latLngBounds(routeLatLngs(drone)).pad(0.4));
  }

  function lookupSerial(e) {
    e.preventDefault();
    const q = serialQuery.trim().toLowerCase();
    if (!q) return;

    const byStatus = STATUS_FILTERS.find(
      (s) => s.label.toLowerCase() === q || s.id === q,
    );
    if (byStatus) {
      openStatus(byStatus.id);
      return;
    }

    const drone = DRONES_DB.find(
      (d) =>
        d.serial.toLowerCase() === q ||
        d.name.toLowerCase() === q ||
        d.id.toLowerCase() === q,
    );
    if (drone) {
      openDrone(drone);
      return;
    }

    const unit = DEMO_UNITS.find((u) => u.serial.toLowerCase() === q);
    if (!unit || !mapObj.current) return;
    const site = getSite(unit.siteId);
    if (!site) return;
    setSelectedDrone(null);
    setActiveStatus(null);
    setSitePeek({ site, units: unitsAtSite(site.id), focusSerial: unit.serial });
    mapObj.current.flyTo([site.lat, site.lon], 9, { duration: 0.9 });
  }

  const activeFilter = STATUS_FILTERS.find((s) => s.id === activeStatus);

  return (
    <div className="live-map">
      <div ref={mapRef} className="live-map-canvas" />

      <div className="hud-coords">
        <div className="hud-title">◉ Демо-зона (не реальна адреса)</div>
        <div className="hud-row">
          <span className="hud-key">LAT</span>
          <span className="hud-val">{coords.lat}</span>
        </div>
        <div className="hud-row">
          <span className="hud-key">LON</span>
          <span className="hud-val">{coords.lon}</span>
        </div>
        <div className="hud-sep" />
        <form className="hud-lookup" onSubmit={lookupSerial}>
          <input
            className="mono"
            value={serialQuery}
            onChange={(e) => setSerialQuery(e.target.value)}
            placeholder="A7K-2941 або Assembled"
          />
          <button type="submit" className="btn btn-primary">
            Знайти
          </button>
        </form>
        <div className="hud-drone-switch">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`hud-drone-btn${activeStatus === s.id ? " is-active" : ""}`}
              style={{ "--d": s.color }}
              onClick={() => openStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hud-stats">
        <div className="stat-card">
          <div className="stat-label">Дрони</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Зібрано</div>
          <div className="stat-value">{stats.assembled}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">На лінії</div>
          <div className="stat-value light">{stats.onLine}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Демо-зон</div>
          <div className="stat-value light">{stats.sites}</div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-title">Статуси</div>
        {STATUS_FILTERS.map((s) => (
          <div key={s.id} className="legend-item">
            <div className="legend-dot" style={{ background: s.color }} />
            {s.label} · {dronesByStatus(s.id).length}
          </div>
        ))}
        <p className="legend-note">
          Лінії зʼєднують етапи збірки / логістики. Точки — фіктивні демо-зони.
        </p>
      </div>

      <div className={`order-panel${panelOpen ? " open" : ""}`}>
        {selectedDrone ? (
          <>
            <div className="op-head">
              <div>
                <div className="op-id">{selectedDrone.name}</div>
                <div className="op-total mono">{selectedDrone.serial}</div>
              </div>
              <button
                type="button"
                className="op-close"
                onClick={() => {
                  setSelectedDrone(null);
                  if (!activeStatus) setActiveStatus(selectedDrone.status);
                }}
                aria-label="Назад до списку"
              >
                ←
              </button>
            </div>
            <div className="op-body">
              <div className="op-row">
                <span className="op-k">Модель</span>
                <span className="op-v">{selectedDrone.model}</span>
              </div>
              <div className="op-row">
                <span className="op-k">Партія</span>
                <span className="op-v">{selectedDrone.batchId}</span>
              </div>
              <div className="op-row">
                <span className="op-k">Статус</span>
                <span className="op-v hi">{STATUS_LABEL[selectedDrone.status]}</span>
              </div>
              <div className="op-breakdown">
                <div className="op-bd-title">Маршрут (waypoints)</div>
                {selectedDrone.waypoints.map((wp, i) => (
                  <div key={wp.id} className="bd-block">
                    <div className="op-row">
                      <span className="op-k">#{i + 1}</span>
                      <span className="op-v">{wp.label}</span>
                    </div>
                    <div className="op-chips">
                      <span className="chip">{wp.stage}</span>
                      <span className="chip">{getSite(wp.siteId)?.near}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="op-actions">
                <Link
                  className="btn btn-primary op-quality-btn"
                  to={`/app/quality?batch=${selectedDrone.batchId}&serial=${selectedDrone.serial}`}
                >
                  Якість партії →
                </Link>
                <p className="op-actions-note">
                  Виробник: {getManufacturer(selectedDrone).name}
                </p>
              </div>
            </div>
          </>
        ) : activeStatus && activeFilter ? (
          <>
            <div className="op-head">
              <div>
                <div className="op-id">{activeFilter.label}</div>
                <div className="op-total">{statusList.length} дронів</div>
              </div>
              <button
                type="button"
                className="op-close"
                onClick={closePanel}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>
            <div className="op-body">
              <div className="op-bd-title">Обери дрон для маршруту</div>
              <ul className="op-drone-list">
                {statusList.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      className="op-drone-item"
                      onClick={() => openDrone(d)}
                    >
                      <span className="op-drone-name">{d.name}</span>
                      <span className="op-drone-serial mono">{d.serial}</span>
                      <span className="op-drone-meta">
                        {d.model} · {d.waypoints.length} точок
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : sitePeek ? (
          <>
            <div className="op-head">
              <div>
                <div className="op-id">{sitePeek.site?.label}</div>
                <div className="op-total">{sitePeek.site?.near}</div>
              </div>
              <button
                type="button"
                className="op-close"
                onClick={closePanel}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>
            <div className="op-body">
              <div className="op-row">
                <span className="op-k">Примітка</span>
                <span className="op-v hi">{sitePeek.site?.note}</span>
              </div>
              <div className="op-breakdown">
                <div className="op-bd-title">Вироби на зоні</div>
                {(sitePeek.units || []).length === 0 && (
                  <p className="legend-note">Немає активних виробів на цій точці.</p>
                )}
                {(sitePeek.units || []).map((u) => (
                  <button
                    key={u.serial}
                    type="button"
                    className="op-drone-item"
                    onClick={() => {
                      const drone = DRONES_DB.find((d) => d.id === u.droneId);
                      if (drone) openDrone(drone);
                    }}
                  >
                    <span className="op-drone-name">{u.name || u.serial}</span>
                    <span className="op-drone-serial mono">{u.serial}</span>
                    <span className="op-drone-meta">
                      {STATUS_LABEL[u.status]} · {u.stage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
