import { cookies } from "next/headers";
import Link from "next/link";
import { query } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { ShoppingBag, Calendar, MapPin, Activity } from "lucide-react";

export const revalidate = 0;

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user = null;
  if (token) {
    user = await verifyJWT(token);
  }

  // Fallback check (though middleware should block this)
  if (!user) {
    return (
      <main
        className="section"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
            Please log in to view your orders.
          </p>
          <Link href="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  let orders = [];
  try {
    // Fetch orders using raw SQL with JOIN aggregation
    orders = await query(
      `SELECT o.*, COUNT(oi.id) as item_count 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       GROUP BY o.id 
       ORDER BY o.created_at DESC`,
      [user.id],
    );
  } catch (error) {
    console.error("Failed to query customer orders:", error);
  }

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <span className="badge badge-warning">Pending</span>;
      case "PROCESSING":
        return <span className="badge badge-info">Processing</span>;
      case "SHIPPED":
        return (
          <span
            className="badge badge-info"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
            }}
          >
            Shipped
          </span>
        );
      case "DELIVERED":
        return <span className="badge badge-success">Delivered</span>;
      case "CANCELLED":
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <main className="section animate-fade" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{ fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}
          >
            Your Orders
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Track shipping progress, view receipts, and review your order
            history.
          </p>
        </div>

        {orders.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="card glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Order Top Panel Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        fontWeight: "600",
                      }}
                    >
                      Order ID
                    </span>
                    <strong
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {order.id}
                    </strong>
                  </div>

                  <div
                    style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Calendar size={14} style={{ color: "var(--primary)" }} />
                      <span>{order.created_at.substring(0, 10)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <ShoppingBag
                        size={14}
                        style={{ color: "var(--primary)" }}
                      />
                      <span>
                        {order.item_count}{" "}
                        {order.item_count === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "var(--primary)",
                      }}
                    >
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Details Body */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.8fr",
                    gap: "24px",
                  }}
                  className="order-item-body"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <MapPin
                      size={16}
                      style={{
                        color: "var(--text-muted)",
                        marginTop: "3px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ fontSize: "13px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          color: "var(--text-secondary)",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Shipping Address
                      </span>
                      <p style={{ color: "var(--text-primary)" }}>
                        {order.shipping_address}
                      </p>
                      <p
                        style={{ color: "var(--text-muted)", marginTop: "4px" }}
                      >
                        Phone: {order.contact_phone}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <Activity
                      size={16}
                      style={{
                        color: "var(--text-muted)",
                        marginTop: "3px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ fontSize: "13px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          color: "var(--text-secondary)",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Order Tracking Status
                      </span>
                      <p style={{ color: "var(--text-primary)" }}>
                        {order.status === "PENDING" &&
                          "We are reviewing your transaction details. Processing will begin shortly."}
                        {order.status === "PROCESSING" &&
                          "Your order is currently being packed at our central fulfillment warehouse."}
                        {order.status === "SHIPPED" &&
                          "The carrier has received the package. Shipped transit tracking information is active."}
                        {order.status === "DELIVERED" &&
                          "Package was successfully delivered. Thank you for shopping with us!"}
                        {order.status === "CANCELLED" &&
                          "This transaction record was voided and cancelled."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              border: "1px dashed var(--border-color)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--primary-glow)",
                color: "var(--primary)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <ShoppingBag size={24} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              No orders found
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              You haven't placed any purchases yet.
            </p>
            <Link href="/products" className="btn btn-primary">
              Browse Storefront Catalog
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-item-body {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </main>
  );
}
