"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="card card-hover animate-fade"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Product Image Container */}
      <Link
        href={`/products/${product.id}`}
        style={{
          display: "block",
          overflow: "hidden",
          borderRadius: "var(--radius-md)",
          aspectRatio: "1/1",
          background: "#f1f5f9",
          position: "relative",
        }}
      >
        <img
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80"
          }
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          className="product-card-image"
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {isOutOfStock && (
          <span
            className="badge badge-danger"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {product.category}
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "var(--primary)",
            }}
          >
            ${product.price.toFixed(2)}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          style={{ display: "block", marginBottom: "8px" }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-primary)",
              lineBreak: "anywhere",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineBreak: "anywhere",
          }}
        >
          {product.description}
        </p>

        {/* Add to Cart button */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? "btn-secondary" : "btn-primary"}`}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
