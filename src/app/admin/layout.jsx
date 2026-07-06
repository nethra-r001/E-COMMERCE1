"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  Package,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  Menu,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Check if user is logged in and is an Admin
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.user) {
          if (data.user.role !== "ADMIN") {
            router.push("/");
          } else {
            setAdminName(data.user.name);
          }
        } else {
          router.push("/login?redirect=/admin");
        }
      } catch (e) {
        router.push("/");
      }
    };
    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      }
    } catch (e) {
      console.error("Logout failed");
    }
  };

  return (
    <div
      className="dark-theme"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-primary)",
      }}
    >
      {/* 1. Admin Dashboard Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "var(--sidebar-width)" : "80px",
          backgroundColor: "var(--bg-surface)",
          borderRight: "1px solid var(--border-color)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 90,
          position: "relative",
        }}
      >
        {/* Sidebar Header Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            overflow: "hidden",
            padding: "0 8px",
          }}
        >
          <UserCheck
            size={28}
            style={{ color: "var(--primary)", flexShrink: 0 }}
          />
          {sidebarOpen && (
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                fontFamily: "var(--font-family-title)",
                whiteSpace: "nowrap",
              }}
            >
              Admin<span style={{ color: "var(--primary)" }}>Hub</span>
            </span>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link
            href="/admin"
            className={`admin-nav-link ${pathname === "/admin" ? "active" : ""}`}
            style={getNavLinkStyle(pathname === "/admin", sidebarOpen)}
          >
            <BarChart2 size={20} />
            {sidebarOpen && <span>Overview Analytics</span>}
          </Link>

          <Link
            href="/admin/products"
            className={`admin-nav-link ${pathname.startsWith("/admin/products") ? "active" : ""}`}
            style={getNavLinkStyle(
              pathname.startsWith("/admin/products"),
              sidebarOpen,
            )}
          >
            <Package size={20} />
            {sidebarOpen && <span>Manage Products</span>}
          </Link>

          <Link
            href="/admin/orders"
            className={`admin-nav-link ${pathname.startsWith("/admin/orders") ? "active" : ""}`}
            style={getNavLinkStyle(
              pathname.startsWith("/admin/orders"),
              sidebarOpen,
            )}
          >
            <ShoppingBag size={20} />
            {sidebarOpen && <span>Manage Orders</span>}
          </Link>

          <div
            style={{
              margin: "20px 0",
              borderTop: "1px solid var(--border-color)",
            }}
          />

          <Link
            href="/"
            className="admin-nav-link"
            style={getNavLinkStyle(false, sidebarOpen)}
          >
            <ArrowLeft size={20} />
            {sidebarOpen && <span>Storefront Home</span>}
          </Link>
        </nav>

        {/* Sidebar Footer Admin Profile & Logout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "16px",
          }}
        >
          {sidebarOpen && (
            <div
              style={{
                padding: "0 8px",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Logged in as{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {adminName}
              </strong>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              width: "100%",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              gap: "10px",
              padding: "10px",
              borderColor: "rgba(239, 68, 68, 0.2)",
              color: "var(--danger)",
            }}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header toolbar */}
        <header
          style={{
            height: "70px",
            backgroundColor: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-color)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "var(--radius-sm)",
            }}
            className="collapse-btn"
          >
            <Menu size={20} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--success)",
              }}
            ></span>
            <span>Security Shield Active</span>
          </div>
        </header>

        {/* Content Children */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        .collapse-btn:hover {
          background-color: var(--border-color);
        }
        .admin-nav-link:hover {
          background-color: var(--border-color) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
}

// Nav link style generator
function getNavLinkStyle(isActive, isOpen) {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    color: isActive ? "var(--primary)" : "var(--text-secondary)",
    background: isActive ? "var(--primary-glow)" : "transparent",
    fontWeight: isActive ? "700" : "500",
    fontSize: "14px",
    cursor: "pointer",
    justifyContent: isOpen ? "flex-start" : "center",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };
}
