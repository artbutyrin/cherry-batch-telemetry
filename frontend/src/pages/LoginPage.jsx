import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GradientWaves from "../components/GradientWaves";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, roles, login, homeFor } = useAuth();
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState("admin");
  const [name, setName] = useState("");

  if (user) {
    const dest =
      user.roleId === "assembler" && !user.stationId
        ? "/app/assembler/station"
        : homeFor(user.roleId);
    return <Navigate to={dest} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const home = login(roleId, name);
    navigate(home || "/app");
  }

  return (
    <div className="login">
      <div className="login-waves" aria-hidden>
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>
      <div className="login-veil" aria-hidden />

      <div className="login-panel">
        <h1>Cherry Trace</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-roles" role="radiogroup" aria-label="Роль">
            {Object.values(roles).map((role) => (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={roleId === role.id}
                className={`login-role${roleId === role.id ? " is-selected" : ""}`}
                onClick={() => setRoleId(role.id)}
              >
                <span className="login-role-title mono">{role.label}</span>
                <span className="login-role-desc">{role.description}</span>
              </button>
            ))}
          </div>

          <div className="field">
            <label htmlFor="displayName">Імʼя (опційно)</label>
            <input
              id="displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Наприклад: Олена"
              autoComplete="nickname"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Увійти як {roles[roleId].label}
          </button>
        </form>
      </div>
    </div>
  );
}
