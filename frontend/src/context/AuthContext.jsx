import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const ROLE_META = {
  admin: {
    id: "admin",
    label: "Розробник",
    description: "Повний кабінет: головна, трекінг, відгуки, якість",
    home: "/app",
  },
  engineer: {
    id: "engineer",
    label: "Адмін Інженер R&D",
    description: "Логістика переміщень, партії, сигнал з поля",
    home: "/app/logistics",
  },
  assembler: {
    id: "assembler",
    label: "Збиральник",
    description: "Пункт збірки: комплектуючі й стан дрона",
    home: "/app/assembler/station",
  },
};

function loadUser() {
  try {
    const raw = sessionStorage.getItem("cherry_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const value = useMemo(
    () => ({
      user,
      roles: ROLE_META,
      login(roleId, name, extra = {}) {
        const role = ROLE_META[roleId];
        if (!role) return null;
        const next = {
          roleId: role.id,
          roleLabel: role.label,
          name: name?.trim() || role.label,
          stationId: extra.stationId || null,
          stationLabel: extra.stationLabel || null,
          ...extra,
        };
        sessionStorage.setItem("cherry_user", JSON.stringify(next));
        setUser(next);
        return role.home;
      },
      setStation(station) {
        setUser((prev) => {
          if (!prev) return prev;
          const next = {
            ...prev,
            stationId: station?.id || null,
            stationLabel: station?.label || null,
          };
          sessionStorage.setItem("cherry_user", JSON.stringify(next));
          return next;
        });
      },
      logout() {
        sessionStorage.removeItem("cherry_user");
        setUser(null);
      },
      homeFor(roleId) {
        return ROLE_META[roleId]?.home || "/app";
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
