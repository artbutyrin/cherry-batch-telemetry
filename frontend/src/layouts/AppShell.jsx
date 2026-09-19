import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BorderGlow from "../components/BorderGlow";
import "./AppShell.css";

const NAV_BY_ROLE = {
  admin: [
    { to: "/app", end: true, label: "Головна" },
    { to: "/app/tracking", label: "Трекінг збірки" },
    { to: "/app/feedback", label: "Відгуки з поля" },
    { to: "/app/quality", label: "Якість партій" },
  ],
  engineer: [
    { to: "/app/logistics", end: true, label: "Логістика" },
    { to: "/app/tracking", label: "Карта трекінгу" },
    { to: "/app/feedback", label: "Відгуки з поля" },
    { to: "/app/quality", label: "Якість партій" },
  ],
  assembler: [
    { to: "/app/assembler/bench", end: true, label: "Верстак" },
    { to: "/app/assembler/station", label: "Змінити пункт" },
  ],
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = NAV_BY_ROLE[user?.roleId] || NAV_BY_ROLE.admin;

  const bleed =
    location.pathname === "/app" || location.pathname.startsWith("/app/tracking");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <img
            className="shell-logo"
            src="/cherry.svg"
            alt=""
            width={28}
            height={40}
            aria-hidden
          />
          <div>
            <div className="shell-title mono">CHERRY TRACE</div>
            <div className="shell-sub">
              {user?.stationLabel
                ? `${user.stationLabel} · ${user.roleLabel}`
                : "General Cherry · внутрішній кабінет"}
            </div>
          </div>
        </div>
        <div className="shell-user">
          <span className="pill pill-accent">{user?.roleLabel}</span>
          <span className="shell-name">{user?.name}</span>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sidebar" aria-label="Навігація">
          <nav className="shell-nav">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shell-nav-glow${isActive ? " is-active" : ""}`
                }
              >
                {({ isActive }) => (
                  <BorderGlow
                    className={`border-glow-nav${isActive ? " is-active" : ""}`}
                    edgeSensitivity={28}
                    glowColor="350 100 60"
                    backgroundColor="#000000"
                    borderRadius={10}
                    glowRadius={22}
                    glowIntensity={1}
                    coneSpread={22}
                    animated={false}
                    colors={["#ff3358", "#ff8da1", "#fb0029"]}
                    fillOpacity={0.45}
                  >
                    <span className="border-glow-nav-link">{item.label}</span>
                  </BorderGlow>
                )}
              </NavLink>
            ))}
          </nav>
          <p className="shell-sidebar-note">
            {user?.roleId === "assembler"
              ? "Пункти Житомир / Одеса / Київ — демо-відділення."
              : "Точки на карті — демо-зони, не реальні адреси виробництв."}
          </p>
        </aside>

        <main className={`shell-main${bleed ? " is-bleed" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
