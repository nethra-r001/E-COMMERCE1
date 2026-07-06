"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams?.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate name contains only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setError("Name must contain only letters and spaces");
      setLoading(false);
      return;
    }

    // Validate phone is exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Successful signup
      window.dispatchEvent(new Event("auth-change"));
      router.push(redirectUrl);
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
          Create Account
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Sign up to start shopping on our platform.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number (10 digits)
          </label>
          <input
            className="form-input"
            type="tel"
            id="phone"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").substring(0, 10))
            }
            required
            disabled={loading}
          />
        </div>

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
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            placeholder="•••••••• (Min 6 chars)"
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
          {loading ? "Creating account..." : "Create Account"}
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
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "var(--primary)", fontWeight: "600" }}
          className="btn-link"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
        <SignupForm />
      </Suspense>
    </main>
  );
}
