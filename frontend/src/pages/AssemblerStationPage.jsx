import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ASSEMBLY_STATIONS } from "../mocks/data";
import "./AssemblerPages.css";

export default function AssemblerStationPage() {
  const { user, setStation, logout } = useAuth();
  const navigate = useNavigate();

  function pick(station) {
    setStation(station);
    navigate("/app/assembler/bench");
  }

  return (
    <div className="asm-page">
      <header className="asm-head">
        <div>
          <p className="eyebrow">Збиральник · реєстрація на пункті</p>
          <h1>З якого пункту збирання ви працюєте?</h1>
          <p className="asm-lede">
            Привіт, {user?.name}. Оберіть відділення — далі фіксуватимете
            комплектуючі й стан дрона. Міста умовні (демо), не реальні адреси
            виробництв.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => { logout(); navigate("/login"); }}>
          Інша роль
        </button>
      </header>

      <div className="asm-stations">
        {ASSEMBLY_STATIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="asm-station-card"
            onClick={() => pick(s)}
          >
            <span className="asm-station-city mono">{s.label}</span>
            <span className="asm-station-desk">{s.desk}</span>
            <span className="asm-station-note">{s.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
