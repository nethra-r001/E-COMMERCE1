"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams?.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Successful login
      // Dispatch custom event to let navbar know auth changed
      window.dispatchEvent(new Event("auth-change"));

      // If user is Admin and no custom redirect, send to admin dashboard
      if (data.user?.role === "ADMIN" && redirectUrl === "/") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="card glass-card animate-slide"
      style={{ maxWidth: "450px", width: "100%", padding: "40px" }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2
          style={{ fontSize: "32px", marginBottom: "8px", fontWeight: "800" }}
        >
          Welcome Back
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Log in to manage your orders and profile.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label
              className="form-label"
              htmlFor="password"
              style={{ margin: "0" }}
            >
              Password
            </label>
          </div>
          <input
            className="form-input"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%", padding: "14px", fontSize: "15px" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div
        style={{
          marginTop: "28px",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--text-secondary)",
        }}
      >
        Don't have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "var(--primary)", fontWeight: "600" }}
          className="btn-link"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color)",
        padding: "24px",
      }}
    >
      <Suspense
        fallback={
          <div style={{ color: "var(--text-secondary)" }}>Loading form...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
