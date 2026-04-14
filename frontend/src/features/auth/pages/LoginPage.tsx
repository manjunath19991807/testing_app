import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { AuthHero } from "../components/AuthHero";
import { authApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const signupEmail = (location.state as { signupEmail?: string } | null)
      ?.signupEmail;

    if (signupEmail) {
      setEmail(signupEmail);
    }
  }, [location.state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const session = await authApi.login({ email, password });
      login(session);
      navigate("/dashboard", { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to log in right now.",
      );
    }
  }

  return (
    <div
      className="page two-column"
      style={{ paddingTop: 48, alignItems: "stretch" }}
    >
      <AuthHero
        eyebrow="Welcome back"
        title="Log in to your private analytics workspace"
        description="Keep the auth experience calm and focused. Clear next steps beat flashy forms."
        bullets={[
          "Your dashboards stay private to your account.",
          "Uploaded datasets remain scoped to the authenticated user.",
          "You can return later and keep building from where you left off.",
        ]}
      />
      <Card
        title="Log in"
        subtitle="Authenticate against your own Express and Postgres backend."
      >
        <form className="stack" onSubmit={handleSubmit}>
          {(location.state as { signupEmail?: string } | null)?.signupEmail ? (
            <p style={{ margin: 0, color: "var(--primary)" }}>
              Account created. Log in with your new email to continue.
            </p>
          ) : null}
          <input
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            style={inputStyle}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
            Use the account you created during signup.
          </p>
          {error ? (
            <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
          ) : null}
          <Button type="submit">Continue</Button>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Need an account?{" "}
            <Link to="/signup" style={linkStyle}>
              Create one
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  background: "white",
} as const;

const linkStyle = {
  color: "var(--primary)",
  fontWeight: 700,
} as const;
