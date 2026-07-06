"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  CreditCard,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  // Form states
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Flow states
  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Payment, 3 = Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [discountRate, setDiscountRate] = useState(0);

  // Load discount rate from cart page coupon
  useEffect(() => {
    const savedRate = localStorage.getItem("discountRate");
    if (savedRate) {
      setDiscountRate(parseFloat(savedRate) || 0);
    }
  }, []);

  // Shipping, Tax, Discount calculations
  const shippingCost = cartTotal >= 50 ? 0 : 5.99;
  const taxCost = cartTotal * 0.08;
  const discountCost = cartTotal * discountRate;
  const grandTotal = cartTotal + shippingCost + taxCost - discountCost;

  // Protect page client-side (ensure cart has items unless confirmed)
  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      router.push("/cart");
    }
  }, [cart, step, router]);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!shippingAddress.trim() || !contactPhone.trim()) {
        setError("Please fill in all shipping fields");
        return;
      }
      if (contactPhone.length !== 10) {
        setError("Contact phone number must be exactly 10 digits");
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !cardName.trim() ||
      !cardNumber.trim() ||
      !cardExpiry.trim() ||
      !cardCvv.trim()
    ) {
      setError("Please fill in all payment details");
      return;
    }

    // Mock card validation checks
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Invalid card number format (must be 16 digits)");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          contactPhone,
          total: grandTotal.toFixed(2),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order. Please try again.");
        setLoading(false);
        return;
      }

      // Order success
      setOrderId(data.orderId);
      clearCart();
      // Clean up coupon local storage
      localStorage.removeItem("discountCode");
      localStorage.removeItem("discountRate");
      setStep(3);
    } catch (err) {
      setError(
        "Failed to process checkout. Please check your network connection.",
      );
      setLoading(false);
    }
  };

  // 1. Success confirmation step layout
  if (step === 3) {
    return (
      <main
        className="section"
        style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}
      >
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: "500px" }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--success-glow)",
              color: "var(--success)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <CheckCircle size={44} />
          </div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "12px",
            }}
          >
            Order Confirmed!
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "16px",
              fontSize: "15px",
            }}
          >
            Thank you for your purchase. Your payment was validated
            successfully, and we have received your order.
          </p>
          <div
            className="card"
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-color)",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                display: "block",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Your Transaction ID
            </span>
            <strong
              style={{
                fontSize: "14px",
                fontFamily: "monospace",
                color: "var(--text-primary)",
              }}
            >
              {orderId}
            </strong>
          </div>
          <div
            style={{ display: "flex", gap: "16px", justifyContent: "center" }}
          >
            <Link href="/orders" className="btn btn-primary">
              View Order History
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Back to Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section animate-fade" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Checkout Header Progress */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h1 style={{ fontSize: "32px", fontWeight: "800" }}>
            Secure Checkout
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            <span
              style={{
                fontWeight: step === 1 ? "700" : "500",
                color: step === 1 ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              1. Shipping Info
            </span>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
            <span
              style={{
                fontWeight: step === 2 ? "700" : "500",
                color: step === 2 ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              2. Secure Payment
            </span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
            <div>{error}</div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "40px",
          }}
          className="checkout-layout"
        >
          {/* Form Wizard Panel */}
          <div>
            {step === 1 ? (
              <div className="card glass-card">
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Shipping Information
                </h3>
                <form onSubmit={handleNextStep}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">
                      Full Delivery Address
                    </label>
                    <textarea
                      id="address"
                      className="form-input"
                      rows={3}
                      placeholder="Street address, apartment, city, state, zip code"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      style={{ resize: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "28px" }}>
                    <label className="form-label" htmlFor="phone">
                      Contact Mobile Phone (10 digits)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={contactPhone}
                      onChange={(e) =>
                        setContactPhone(
                          e.target.value.replace(/\D/g, "").substring(0, 10),
                        )
                      }
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/cart"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                      }}
                      className="btn-link"
                    >
                      <ArrowLeft size={16} />
                      Back to Shopping Cart
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ gap: "8px" }}
                    >
                      Continue to Payment
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card glass-card">
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CreditCard size={20} style={{ color: "var(--primary)" }} />
                  Secure Credit Card Details
                </h3>
                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardname">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardname"
                      className="form-input"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cardnumber">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardnumber"
                      className="form-input"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => {
                        // Basic digit formatting
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .substring(0, 16);
                        const parts = value.match(/.{1,4}/g) || [];
                        setCardNumber(parts.join(" "));
                      }}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div
                    className="grid-2"
                    style={{ gap: "16px", marginBottom: "28px" }}
                  >
                    <div className="form-group" style={{ margin: "0" }}>
                      <label className="form-label" htmlFor="expiry">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="form-input"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 4);
                          if (value.length >= 2) {
                            setCardExpiry(
                              value.substring(0, 2) + "/" + value.substring(2),
                            );
                          } else {
                            setCardExpiry(value);
                          }
                        }}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group" style={{ margin: "0" }}>
                      <label className="form-label" htmlFor="cvv">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        className="form-input"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(
                            e.target.value.replace(/\D/g, "").substring(0, 3),
                          )
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                      disabled={loading}
                      style={{ gap: "6px" }}
                    >
                      <ArrowLeft size={16} />
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                      style={{ gap: "8px" }}
                    >
                      {loading ? "Processing..." : "Place Secure Order"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Summary Side Panel */}
          <div>
            <div
              className="card glass-card"
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                Summary
              </h3>

              {/* Product list preview */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "180px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      justifyItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={item.product.image_url}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                      }}
                    />

                    <div style={{ flex: 1, fontSize: "13px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "150px",
                        }}
                      >
                        {item.product.name}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "13px",
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Subtotal
                  </span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {discountRate > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "var(--success)",
                    }}
                  >
                    <span>Discount (20% off)</span>
                    <span>-${discountCost.toFixed(2)}</span>
                  </div>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Shipping
                  </span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Tax (8%)
                  </span>
                  <span>${taxCost.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "800",
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "12px",
                    marginTop: "4px",
                  }}
                >
                  <span>Total Due</span>
                  <span style={{ color: "var(--primary)" }}>
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure checkout assurance banner */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  background: "var(--bg-color)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <ShieldCheck
                  size={28}
                  style={{ color: "var(--success)", flexShrink: 0 }}
                />
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    margin: "0",
                  }}
                >
                  Your details are fully protected. All data is sent encrypted
                  over secure SSL gateway protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
