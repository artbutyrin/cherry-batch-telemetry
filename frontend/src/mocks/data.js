/** Synthetic demo DB — sites & routes are FICTIONAL, not real factory addresses. */

export const STATUS_FILTERS = [
  { id: "assembled", label: "Assembled", color: "#ff3358" },
  { id: "in_progress", label: "In Progress", color: "#ff8da1" },
  { id: "in_transit", label: "In Transit", color: "#c9c9c9" },
];

export const DEMO_SITES = [
  {
    id: "demo-west",
    label: "Демо-зона «Захід»",
    near: "околиці Львова",
    lat: 49.78,
    lon: 23.95,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-nw",
    label: "Демо-зона «Північний Захід»",
    near: "околиці Луцька",
    lat: 50.7,
    lon: 25.18,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-north",
    label: "Демо-зона «Північ»",
    near: "околиці Чернігова",
    lat: 51.42,
    lon: 31.15,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-eu",
    label: "Демо-зона «EU Partner»",
    near: "околиці Жешува (PL) · партнер",
    lat: 50.02,
    lon: 21.95,
    note: "Фіктивна точка закордонного партнера для демо",
  },
  {
    id: "demo-center",
    label: "Демо-зона «Центр»",
    near: "околиці Вінниці",
    lat: 49.23,
    lon: 28.47,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-south",
    label: "Демо-зона «Південь»",
    near: "околиці Одеси",
    lat: 46.48,
    lon: 30.72,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-east",
    label: "Демо-зона «Схід»",
    near: "околиці Полтави",
    lat: 49.59,
    lon: 34.55,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-kyiv",
    label: "Демо-зона «Столиця»",
    near: "околиці Києва",
    lat: 50.45,
    lon: 30.52,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-zhytomyr",
    label: "Демо-зона «Житомир»",
    near: "околиці Житомира",
    lat: 50.25,
    lon: 28.66,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-ternopil",
    label: "Демо-зона «Тернопіль»",
    near: "околиці Тернополя",
    lat: 49.55,
    lon: 25.59,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-rivne",
    label: "Демо-зона «Рівне»",
    near: "околиці Рівного",
    lat: 50.62,
    lon: 26.25,
    note: "Фіктивна точка для демо",
  },
  {
    id: "demo-uzh",
    label: "Демо-зона «Карпати»",
    near: "околиці Ужгорода",
    lat: 48.62,
    lon: 22.3,
    note: "Фіктивна точка для демо",
  },
];

function wp(id, siteId, label, stage, jitter = 0) {
  const site = DEMO_SITES.find((s) => s.id === siteId);
  const jLat = ((jitter * 17) % 7) * 0.012 - 0.03;
  const jLon = ((jitter * 29) % 7) * 0.014 - 0.035;
  return {
    id,
    siteId,
    label,
    stage,
    lat: site.lat + jLat,
    lon: site.lon + jLon,
  };
}

/** Front-end demo DB: assembly / logistics events across statuses. */
export const DRONES_DB = [
  // —— Assembled ——
  {
    id: "drone-a1",
    name: "FPV Alpha",
    serial: "A7K-2941",
    model: "Cherry FPV Demo",
    batchId: "B-12",
    status: "assembled",
    color: "#ff3358",
    waypoints: [
      wp("a1-1", "demo-west", "Рама + електроніка", "Збірка", 1),
      wp("a1-2", "demo-nw", "Калібрування IMU", "Тест", 1),
      wp("a1-3", "demo-north", "Видача підрозділу", "Логістика", 1),
    ],
  },
  {
    id: "drone-a2",
    name: "FPV Beta",
    serial: "A7K-2955",
    model: "Cherry FPV Demo",
    batchId: "B-12",
    status: "assembled",
    color: "#ff5c79",
    waypoints: [
      wp("a2-1", "demo-zhytomyr", "Пайка ESC + FC", "Збірка", 2),
      wp("a2-2", "demo-kyiv", "Bench flight", "Тест", 2),
      wp("a2-3", "demo-east", "Пакування / видача", "Логістика", 2),
    ],
  },
  {
    id: "drone-a3",
    name: "Interceptor Nova",
    serial: "B2M-1088",
    model: "Interceptor Demo",
    batchId: "B-16",
    status: "assembled",
    color: "#fb0029",
    waypoints: [
      wp("a3-1", "demo-center", "Збірка рами", "Збірка", 3),
      wp("a3-2", "demo-kyiv", "RF / VTX QA", "QA", 3),
      wp("a3-3", "demo-south", "Видача на південь", "Логістика", 3),
    ],
  },
  {
    id: "drone-a4",
    name: "FPV Gamma",
    serial: "A7K-3018",
    model: "Cherry FPV Demo",
    batchId: "B-18",
    status: "assembled",
    color: "#d80030",
    waypoints: [
      wp("a4-1", "demo-ternopil", "Мотори + лопаті", "Збірка", 4),
      wp("a4-2", "demo-west", "Калібрування камери", "Тест", 4),
      wp("a4-3", "demo-rivne", "Склад готових", "Логістика", 4),
    ],
  },

  // —— In Progress ——
  {
    id: "drone-p1",
    name: "Line Hawk",
    serial: "A7K-3010",
    model: "Cherry FPV Demo",
    batchId: "B-14",
    status: "in_progress",
    color: "#ff8da1",
    waypoints: [
      wp("p1-1", "demo-eu", "Комплектуючі (партнер)", "Постачання", 1),
      wp("p1-2", "demo-west", "Фінальна збірка", "Збірка", 1),
      wp("p1-3", "demo-nw", "Пайка ESC · на лінії", "Пайка ESC", 1),
    ],
  },
  {
    id: "drone-p2",
    name: "Line Sparrow",
    serial: "A7K-3042",
    model: "Cherry FPV Demo",
    batchId: "B-14",
    status: "in_progress",
    color: "#ffb8c5",
    waypoints: [
      wp("p2-1", "demo-south", "Прийом комплекту", "Постачання", 2),
      wp("p2-2", "demo-zhytomyr", "Монтаж камери", "Збірка", 2),
      wp("p2-3", "demo-kyiv", "Прошивка FC", "Тест", 2),
    ],
  },
  {
    id: "drone-p3",
    name: "Line Kite",
    serial: "C9X-4410",
    model: "Cherry Scout Demo",
    batchId: "B-19",
    status: "in_progress",
    color: "#ffe3e9",
    waypoints: [
      wp("p3-1", "demo-uzh", "Рама з партнера", "Постачання", 3),
      wp("p3-2", "demo-ternopil", "Обвʼязка кабелів", "Збірка", 3),
      wp("p3-3", "demo-center", "Баланс пропелерів", "Тест", 3),
    ],
  },
  {
    id: "drone-p4",
    name: "Line Falcon",
    serial: "A7K-3099",
    model: "Cherry FPV Demo",
    batchId: "B-20",
    status: "in_progress",
    color: "#ff5c79",
    waypoints: [
      wp("p4-1", "demo-rivne", "Складський kit", "Постачання", 4),
      wp("p4-2", "demo-zhytomyr", "Пайка моторів", "Збірка", 4),
      wp("p4-3", "demo-kyiv", "Smoke test", "Тест", 4),
    ],
  },
  {
    id: "drone-p5",
    name: "Line Wren",
    serial: "B2M-1201",
    model: "Interceptor Demo",
    batchId: "B-21",
    status: "in_progress",
    color: "#ff8da1",
    waypoints: [
      wp("p5-1", "demo-east", "Старт рами", "Збірка", 5),
      wp("p5-2", "demo-kyiv", "Антенний блок", "Збірка", 5),
      wp("p5-3", "demo-north", "Перевірка живлення", "QA", 5),
    ],
  },

  // —— In Transit ——
  {
    id: "drone-t1",
    name: "Transit Orion",
    serial: "B2M-1104",
    model: "Interceptor Demo",
    batchId: "B-15",
    status: "in_transit",
    color: "#c9c9c9",
    waypoints: [
      wp("t1-1", "demo-north", "Старт збірки", "Збірка", 1),
      wp("t1-2", "demo-west", "Перевірка якості", "QA", 1),
      wp("t1-3", "demo-eu", "Транзит / партнер", "Логістика", 1),
    ],
  },
  {
    id: "drone-t2",
    name: "Transit Vega",
    serial: "B2M-1120",
    model: "Interceptor Demo",
    batchId: "B-15",
    status: "in_transit",
    color: "#b8b8b8",
    waypoints: [
      wp("t2-1", "demo-kyiv", "Фінальний тест", "Тест", 2),
      wp("t2-2", "demo-east", "Пакування", "Логістика", 2),
      wp("t2-3", "demo-south", "У дорозі на південь", "Логістика", 2),
    ],
  },
  {
    id: "drone-t3",
    name: "Transit Mira",
    serial: "A7K-3188",
    model: "Cherry FPV Demo",
    batchId: "B-17",
    status: "in_transit",
    color: "#828282",
    waypoints: [
      wp("t3-1", "demo-zhytomyr", "Готово до відправки", "Збірка", 3),
      wp("t3-2", "demo-rivne", "Хаб логістики", "Логістика", 3),
      wp("t3-3", "demo-uzh", "Кордон / партнер", "Логістика", 3),
    ],
  },
  {
    id: "drone-t4",
    name: "Transit Lyra",
    serial: "C9X-4502",
    model: "Cherry Scout Demo",
    batchId: "B-22",
    status: "in_transit",
    color: "#696969",
    waypoints: [
      wp("t4-1", "demo-center", "QA партії", "QA", 4),
      wp("t4-2", "demo-kyiv", "Сортування", "Логістика", 4),
      wp("t4-3", "demo-north", "Транзит на північ", "Логістика", 4),
    ],
  },
];

/** Flat list of journey stops for home-page scroll storytelling. */
export const JOURNEY_STOPS = [
  {
    id: "stop-west",
    siteId: "demo-west",
    title: "Захід · збірка рами",
    body: "Демо-зона біля Львова: перший дрон проходить раму й електроніку. Точка фіктивна.",
    lat: 49.78,
    lon: 23.95,
    droneIds: ["drone-a1", "drone-p1"],
  },
  {
    id: "stop-nw",
    siteId: "demo-nw",
    title: "Пн. Захід · калібрування",
    body: "Околиці Луцька (демо): калібрування й пайка ESC. Другий дрон зараз на лінії.",
    lat: 50.7,
    lon: 25.18,
    droneIds: ["drone-a1", "drone-p1"],
  },
  {
    id: "stop-north",
    siteId: "demo-north",
    title: "Північ · видача / старт",
    body: "Околиці Чернігова (демо): видача першого дрона, старт третього.",
    lat: 51.42,
    lon: 31.15,
    droneIds: ["drone-a1", "drone-t1"],
  },
  {
    id: "stop-eu",
    siteId: "demo-eu",
    title: "EU Partner · комплектуючі",
    body: "Фіктивна зона біля Жешува (PL): партнерська ланка постачання / транзит.",
    lat: 50.02,
    lon: 21.95,
    droneIds: ["drone-p1", "drone-t1"],
  },
];

/** Detailed BOM parts a drone was built from (demo / fictional suppliers). */
export function getBuildParts(drone) {
  if (!drone) return [];
  const seed = String(drone.serial || drone.id || "X")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const lot = (prefix, n) => `${prefix}-${String((seed * (n + 3)) % 9000 + 1000)}`;
  const isInt = /interceptor/i.test(drone.model || "");
  const isScout = /scout/i.test(drone.model || "");

  const frame = isInt
    ? { sku: "FRM-INT-7", name: "Рама Interceptor 7\"", supplier: "Карбон-Захід (демо)", rev: "r2" }
    : isScout
      ? { sku: "FRM-SCT-5", name: "Рама Scout 5\"", supplier: "Карбон-Захід (демо)", rev: "r1" }
      : { sku: "FRM-FPV-5", name: "Рама FPV 5\"", supplier: "Карбон-Захід (демо)", rev: "r3" };

  const esc = isInt
    ? { sku: "ESC-60A-4in1", name: "ESC 60A 4-in-1", supplier: "PowerCell UA (демо)", rev: "v4" }
    : { sku: "ESC-45A-4in1", name: "ESC 45A 4-in-1", supplier: "PowerCell UA (демо)", rev: "v3" };

  const fc = isScout
    ? { sku: "FC-H7-MINI", name: "Польотний контролер H7 Mini", supplier: "AviCore (демо)", rev: "r9" }
    : { sku: "FC-R9", name: "Польотний контролер R9", supplier: "AviCore (демо)", rev: "r9" };

  const motors = isInt
    ? { sku: "MTR-2807-1300", name: "Мотори 2807 1300KV ×4", supplier: "SpinLab (демо)", rev: "b2" }
    : { sku: "MTR-2207-2450", name: "Мотори 2207 2450KV ×4", supplier: "SpinLab (демо)", rev: "b1" };

  const cam = isInt
    ? { sku: "CAM-LOWLAT", name: "Камера low-latency", supplier: "OpticNode (демо)", rev: "hd2" }
    : { sku: "CAM-HD", name: "Камера HD FPV", supplier: "OpticNode (демо)", rev: "hd1" };

  const vtx = {
    sku: isScout ? "VTX-1W2" : "VTX-800",
    name: isScout ? "VTX 1.2W + антена" : "VTX 800mW + антена",
    supplier: "RF-Link (демо)",
    rev: "a3",
  };

  const props = {
    sku: isInt ? "PRP-7x4" : "PRP-5x4.3",
    name: isInt ? "Лопаті 7×4″ (комплект)" : "Лопаті 5×4.3″ (комплект)",
    supplier: "AeroCut (демо)",
    rev: "p1",
  };

  const battery = {
    sku: isInt ? "BAT-6S-1800" : "BAT-6S-1100",
    name: isInt ? "АКБ 6S 1800mAh (тест)" : "АКБ 6S 1100mAh (тест)",
    supplier: "CellStack (демо)",
    rev: "t1",
  };

  const harness = {
    sku: "WR-HARN-V2",
    name: "Джгут / XT60 обвʼязка",
    supplier: "WireWorks (демо)",
    rev: "v2",
  };

  return [frame, esc, fc, motors, cam, vtx, props, battery, harness].map((part, i) => ({
    ...part,
    lot: lot(part.sku.split("-")[0], i),
    qty: /×4|комплект/i.test(part.name) ? 1 : 1,
    installed: true,
  }));
}

export const DEMO_UNITS = DRONES_DB.map((d) => {
  const last = d.waypoints[d.waypoints.length - 1];
  const parts = getBuildParts(d);
  return {
    serial: d.serial,
    model: d.model,
    batchId: d.batchId,
    siteId: last.siteId,
    status: d.status,
    stage: last.stage || last.label,
    version: parts[0]?.rev || "BOM-demo",
    components: parts.map((p) => p.sku),
    parts,
    progress: d.status === "assembled" ? 1 : d.status === "in_transit" ? 0.7 : 0.45,
    droneId: d.id,
    name: d.name,
  };
});

export const FEEDBACK_CATEGORIES = [
  { id: "motors", label: "Мотори", count: 9, color: "#ff3358" },
  { id: "props", label: "Лопаті", count: 5, color: "#ff8da1" },
  { id: "power", label: "Живлення", count: 4, color: "#ffb8c5" },
  { id: "comms", label: "Звʼязок", count: 3, color: "#d80030" },
  { id: "body", label: "Корпус", count: 2, color: "#828282" },
  { id: "other", label: "Інше", count: 3, color: "#424242" },
];

export const DEMO_FEEDBACK = [
  {
    id: "fb-1",
    serial: "A7K-2941",
    node: "power",
    category: "power",
    symptom: "drains_fast",
    severity: "limited",
    when: "on_check",
    comment: "Швидше сідає після 2 циклів",
    ts: "2026-09-18T14:22:00Z",
  },
  {
    id: "fb-2",
    serial: "A7K-3010",
    node: "power",
    category: "motors",
    symptom: "overheats",
    severity: "limited",
    when: "on_receipt",
    comment: "Мотор гріється",
    ts: "2026-09-18T16:01:00Z",
  },
  {
    id: "fb-3",
    serial: "A7K-3010",
    node: "comms",
    category: "comms",
    symptom: "unstable",
    severity: "minor",
    when: "after_transport",
    comment: "Після тряски в дорозі",
    ts: "2026-09-19T09:10:00Z",
  },
  {
    id: "fb-4",
    serial: "B2M-1104",
    node: "body",
    category: "body",
    symptom: "crack",
    severity: "unusable",
    when: "on_receipt",
    comment: "Тріщина на рамі",
    ts: "2026-09-19T11:40:00Z",
  },
  {
    id: "fb-5",
    serial: "A7K-2941",
    node: "kit",
    category: "props",
    symptom: "part_missing",
    severity: "limited",
    when: "on_receipt",
    comment: "Лопать пошкоджена",
    ts: "2026-09-19T12:05:00Z",
  },
  {
    id: "fb-6",
    serial: "A7K-3042",
    node: "power",
    category: "power",
    symptom: "brownout",
    severity: "limited",
    when: "on_check",
    comment: "Провалюється напруга під навантаженням",
    ts: "2026-09-19T15:20:00Z",
  },
  {
    id: "fb-7",
    serial: "C9X-4410",
    node: "comms",
    category: "comms",
    symptom: "range_low",
    severity: "minor",
    when: "on_check",
    comment: "Дальність VTX нижча за норму",
    ts: "2026-09-19T17:05:00Z",
  },
];

export function getUnit(serial) {
  return DEMO_UNITS.find((u) => u.serial.toLowerCase() === serial.toLowerCase()) || null;
}

export function getSite(siteId) {
  return DEMO_SITES.find((s) => s.id === siteId) || null;
}

export function getDrone(idOrSerial) {
  const q = String(idOrSerial).toLowerCase();
  return (
    DRONES_DB.find((d) => d.id === idOrSerial || d.serial.toLowerCase() === q) || null
  );
}

/** Demo manufacturer passport derived from first assembly site + batch. */
export function getManufacturer(drone) {
  if (!drone) return null;
  const origin = getSite(drone.waypoints?.[0]?.siteId);
  const lineByModel = {
    "Cherry FPV Demo": "Лінія А · FPV",
    "Interceptor Demo": "Лінія B · Interceptor",
    "Cherry Scout Demo": "Лінія C · Scout",
  };
  return {
    name: origin?.label?.replace("Демо-зона", "Виробник") || "Виробник · демо",
    code: `GC-${drone.batchId}-${(origin?.id || "x").replace("demo-", "").toUpperCase()}`,
    line: lineByModel[drone.model] || "Лінія демо",
    site: origin?.near || "фіктивна зона",
    siteNote: origin?.note || "Фіктивна точка для демо",
    bom: drone.model.includes("Interceptor") ? "BOM-INT-demo" : "BOM-FPV-demo",
    qaLead: "R&D desk · мок",
    assembledLabel: drone.waypoints?.[0]?.label || "Старт збірки",
  };
}

export function dronesByStatus(status) {
  return DRONES_DB.filter((d) => d.status === status);
}

/** One sample drone per status for home portfolio cards. */
export function homeStatusSamples() {
  return STATUS_FILTERS.map((filter) => {
    const drone = dronesByStatus(filter.id)[0];
    return drone ? { ...drone, name: filter.label, color: filter.color } : null;
  }).filter(Boolean);
}

export function getBatchSiblings(batchId) {
  return DEMO_UNITS.filter((u) => u.batchId === batchId);
}

export function feedbackForSerial(serial) {
  return DEMO_FEEDBACK.filter((f) => f.serial === serial);
}

export function unitsAtSite(siteId) {
  return DEMO_UNITS.filter((u) => u.siteId === siteId);
}

export function routeLatLngs(drone) {
  return drone.waypoints.map((w) => [w.lat, w.lon]);
}

/** Demo assembly desks for assemblers (city labels — not real factory addresses). */
export const ASSEMBLY_STATIONS = [
  {
    id: "zhytomyr",
    label: "Житомир",
    desk: "Лінія А · рама / ESC",
    note: "Демо-пункт збірки",
  },
  {
    id: "odesa",
    label: "Одеса",
    desk: "Лінія B · камера / RF",
    note: "Демо-пункт збірки",
  },
  {
    id: "kyiv",
    label: "Київ",
    desk: "Лінія C · фінальний тест",
    note: "Демо-пункт збірки",
  },
];

/** Parts an assembler can attach on the bench. */
export const ASSEMBLY_PARTS = [
  { id: "frame", label: "Рама" },
  { id: "esc", label: "ESC" },
  { id: "fc", label: "Польотний контролер" },
  { id: "motors", label: "Мотори" },
  { id: "props", label: "Лопаті" },
  { id: "cam", label: "Камера" },
  { id: "vtx", label: "VTX / антена" },
  { id: "battery", label: "Акумулятор (тест)" },
];

export const ASSEMBLY_STATES = [
  { id: "queued", label: "У черзі", tone: "muted" },
  { id: "in_progress", label: "В роботі", tone: "warn" },
  { id: "parts_ok", label: "Комплектуючі ОК", tone: "accent" },
  { id: "blocked", label: "Блокер / брак", tone: "danger" },
  { id: "ready", label: "Готово до передачі", tone: "accent" },
];
