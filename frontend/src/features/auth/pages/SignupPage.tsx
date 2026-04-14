import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { AuthHero } from "../components/AuthHero";
import { authApi } from "../api/authApi";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await authApi.signup({ email, password });
      setSuccessMessage("Account created. Redirecting you to log in...");
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { signupEmail: email }
        });
      }, 900);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to sign up right now."
      );
    }
  }

  return (
    <div className="page two-column" style={{ paddingTop: 48, alignItems: "stretch" }}>
      <AuthHero
        eyebrow="Set up your space"
        title="Create an account and start with an empty dashboard"
        description="A better first-run flow makes the product feel intentional from the moment the user signs up."
        bullets={[
          "Users land on a guided empty state instead of a blank screen.",
          "CSV upload becomes the primary next step after auth.",
          "Saved dashboards and AI insights can persist across sessions."
        ]}
      />
      <Card
        title="Create account"
        subtitle="This creates a real user in your backend and then redirects to log in."
      >
        <form className="stack" onSubmit={handleSubmit}>
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
            Password must be at least 8 characters.
          </p>
          {error ? <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p> : null}
          {successMessage ? <p style={{ margin: 0, color: "var(--primary)" }}>{successMessage}</p> : null}
          <Button type="submit">Create account</Button>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Already have an account? <Link to="/login" style={linkStyle}>Log in</Link>
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
  background: "white"
} as const;

const linkStyle = {
  color: "var(--primary)",
  fontWeight: 700
} as const;
