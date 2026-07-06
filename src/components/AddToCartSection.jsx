"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AddToCartSection({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Reset or show success feedback
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {!isOutOfStock && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--text-secondary)",
            }}
          >
            Quantity:
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              background: "var(--bg-surface)",
            }}
          >
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 14px",
                cursor: "pointer",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="qty-btn"
            >
              <Minus size={14} />
            </button>
            <span
              style={{
                width: "40px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= product.stock}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 14px",
                cursor: "pointer",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="qty-btn"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn ${isOutOfStock ? "btn-secondary" : "btn-primary"}`}
          style={{
            padding: "14px 28px",
            fontSize: "15px",
            width: "100%",
            maxWidth: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <ShoppingCart size={18} />
          {isOutOfStock ? "Out of Stock" : "Add to Shopping Cart"}
        </button>
      </div>

      <style>{`
        .qty-btn:hover:not(:disabled) {
          background-color: var(--border-color) !important;
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
