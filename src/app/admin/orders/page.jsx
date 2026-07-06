"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Eye, User, MapPin, Phone } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  // Modal / Detail Panel states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } else {
        setError("Failed to load orders list");
      }
    } catch (e) {
      setError("Connection failure while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders on client side
  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((o) => o.status.toUpperCase() === statusFilter),
      );
    }
  }, [statusFilter, orders]);

  const handleInspectOrder = async (order) => {
    setSelectedOrder(order);
    setOrderItems([]);
    setLoadingDetail(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`);
      const data = await res.json();
      if (res.ok) {
        setOrderItems(data.items || []);
      } else {
        setError(data.error || "Failed to fetch order details");
      }
    } catch (err) {
      setError("Failed to fetch details for order " + order.id);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatus(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update orders list states
        const updatedOrders = orders.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o,
        );
        setOrders(updatedOrders);
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update order status");
      }
    } catch (e) {
      setError("Connection error while updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const filters = [
    "ALL",
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "32px" }}
      className="animate-fade"
    >
      {/* Header */}
      <div>
        <h2
          style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}
        >
          Manage Orders
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Monitor sales transactions, inspect items lists, and update order
          tracking status.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <div>{error}</div>
        </div>
      )}

      {/* Filter tab buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "16px",
        }}
      >
        {filters.map((f) => {
          const isActive = statusFilter === f;
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border:
                  "1px solid " +
                  (isActive ? "var(--primary)" : "var(--border-color)"),
                background: isActive
                  ? "var(--primary-glow)"
                  : "var(--bg-surface)",
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: isActive ? "700" : "500",
                fontSize: "12px",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedOrder ? "1.1fr 0.9fr" : "1fr",
          gap: "32px",
          alignItems: "start",
        }}
        className="orders-split-layout"
      >
        {/* Main Orders Table (Left or Center) */}
        <div className="card glass-card" style={{ padding: "24px" }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "var(--text-secondary)",
              }}
            >
              Loading transactions list...
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="table-container">
              <table className="custom-table" style={{ fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th style={{ width: "80px", textAlign: "center" }}>
                      Inspect
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor:
                          selectedOrder?.id === order.id
                            ? "rgba(79, 70, 229, 0.05)"
                            : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => handleInspectOrder(order)}
                    >
                      <td
                        style={{ fontFamily: "monospace", fontWeight: "700" }}
                      >
                        {order.id.substring(0, 10)}...
                      </td>
                      <td>{order.created_at.substring(0, 10)}</td>
                      <td>
                        <strong style={{ display: "block", fontSize: "13px" }}>
                          {order.customer_name}
                        </strong>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {order.customer_email}
                        </span>
                      </td>
                      <td
                        style={{ fontWeight: "700", color: "var(--primary)" }}
                      >
                        ${order.total.toFixed(2)}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInspectOrder(order);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px 10px" }}
                            title="Inspect order details"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <ShoppingBag
                size={36}
                style={{ color: "var(--text-muted)", marginBottom: "12px" }}
              />
              <p style={{ color: "var(--text-secondary)" }}>
                No orders match this status criteria.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Inspection Drawer (Right) */}
        {selectedOrder && (
          <div
            className="card glass-card animate-slide"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Header info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "16px",
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
                  Inspect Order
                </span>
                <strong style={{ fontFamily: "monospace", fontSize: "14px" }}>
                  {selectedOrder.id}
                </strong>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                Close ×
              </button>
            </div>

            {/* Quick Status Modifier dropdown */}
            <div>
              <label className="form-label" htmlFor="status-select">
                Modify Order Tracking State
              </label>
              <select
                id="status-select"
                className="form-input form-select"
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
                disabled={updatingStatus}
                style={{ fontSize: "13px", textTransform: "uppercase" }}
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Customer information */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "var(--bg-color)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <User
                  size={16}
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <strong
                    style={{ display: "block", color: "var(--text-secondary)" }}
                  >
                    Customer Profile
                  </strong>
                  <span>
                    {selectedOrder.customer_name} (
                    {selectedOrder.customer_email})
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <MapPin
                  size={16}
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <strong
                    style={{ display: "block", color: "var(--text-secondary)" }}
                  >
                    Delivery Location
                  </strong>
                  <span>{selectedOrder.shipping_address}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <Phone
                  size={16}
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <strong
                    style={{ display: "block", color: "var(--text-secondary)" }}
                  >
                    Contact Phone
                  </strong>
                  <span>{selectedOrder.contact_phone}</span>
                </div>
              </div>
            </div>

            {/* Items details list */}
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                Items Details
              </h4>
              {loadingDetail ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Loading order lines...
                </div>
              ) : orderItems.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxHeight: "240px",
                    overflowY: "auto",
                  }}
                >
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt=""
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                        }}
                      />

                      <div style={{ flex: 1, fontSize: "12px" }}>
                        <span
                          style={{
                            fontWeight: "700",
                            color: "var(--text-primary)",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "180px",
                          }}
                        >
                          {item.name}
                        </span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "700" }}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Summary Totals */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "800",
                      fontSize: "15px",
                      paddingTop: "10px",
                    }}
                  >
                    <span>Order Total Cost</span>
                    <span style={{ color: "var(--primary)" }}>
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                  No items recorded in this order.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .orders-split-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
