import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DRONES_DB, JOURNEY_STOPS, routeLatLngs } from "../mocks/data";
import "./AssemblyJourneyMap.css";

function markerHtml(color) {
  return `<div style="width:10px;height:10px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};border:1px solid #fff"></div>`;
}

/**
 * Sticky map on the home page: flies between assembly stops as the user scrolls.
 * Cherry palette — no planet WebGL, only real map hops between fictional demo sites.
 */
export default function AssemblyJourneyMap({ activeStopId }) {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const layersRef = useRef({ routes: [], markers: [] });

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([50.4, 26.5], 6);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 16,
      subdomains: "abcd",
    }).addTo(map);

    DRONES_DB.forEach((drone) => {
      const line = L.polyline(routeLatLngs(drone), {
        color: drone.color,
        weight: 3,
        opacity: 0.75,
        dashArray: "6 8",
      }).addTo(map);
      layersRef.current.routes.push(line);

      drone.waypoints.forEach((wp, i) => {
        const m = L.marker([wp.lat, wp.lon], {
          icon: L.divIcon({
            className: "journey-marker",
            html: markerHtml(drone.color),
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          }),
        }).addTo(map);
        m.bindTooltip(`${drone.name} · ${wp.label}`, {
          direction: "top",
          opacity: 0.9,
        });
        layersRef.current.markers.push(m);
        if (i === 0) {
          /* keep first pin visible */
        }
      });
    });

    mapObj.current = map;
    setTimeout(() => map.invalidateSize(), 80);

    return () => {
      map.remove();
      mapObj.current = null;
      layersRef.current = { routes: [], markers: [] };
    };
  }, []);

  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;
    const stop = JOURNEY_STOPS.find((s) => s.id === activeStopId) || JOURNEY_STOPS[0];
    map.flyTo([stop.lat, stop.lon], 8, { duration: 1.15 });
  }, [activeStopId]);

  const stop = JOURNEY_STOPS.find((s) => s.id === activeStopId) || JOURNEY_STOPS[0];

  return (
    <div className="journey-map">
      <div ref={mapRef} className="journey-map-canvas" />
      <div className="journey-map-hud">
        <span className="journey-map-eyebrow">Скрол · маршрут збірки</span>
        <strong>{stop.title}</strong>
        <span className="journey-map-note">Демо-точки · не реальні адреси</span>
      </div>
    </div>
  );
}
