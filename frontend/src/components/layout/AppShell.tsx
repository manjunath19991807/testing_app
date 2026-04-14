import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../features/auth/hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload Data" },
  { to: "/builder/demo-dataset", label: "Chart Builder" },
  { to: "/insights/demo-dataset", label: "Insights" }
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "24px 0 40px" }}>
      <div className="page stack">
        <header className="hero-card">
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <div>
              <p style={{ margin: 0, color: "var(--muted)" }}>Private analytics workspace</p>
              <h1 style={{ margin: "8px 0 0" }}>CSV Analytics Dashboard</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    style={({ isActive }) => ({
                      padding: "10px 14px",
                      borderRadius: 999,
                      background: isActive ? "var(--primary)" : "rgba(255,255,255,0.72)",
                      color: isActive ? "white" : "var(--text)",
                      border: "1px solid var(--border)",
                      fontWeight: 600
                    })}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid var(--border)"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user?.email}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.84rem" }}>Workspace owner</div>
                </div>
                <Button variant="secondary" onClick={logout}>
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
