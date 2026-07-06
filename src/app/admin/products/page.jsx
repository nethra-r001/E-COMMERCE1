"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        setError("Failed to fetch product list");
      }
    } catch (e) {
      setError("Connection error while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete product");
      }
    } catch (e) {
      setError("Connection error during deletion");
    }
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <span className="badge badge-danger">Out of Stock</span>;
    }
    if (stock <= 10) {
      return <span className="badge badge-warning">Low Stock ({stock})</span>;
    }
    return <span className="badge badge-success">In Stock ({stock})</span>;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "32px" }}
      className="animate-fade"
    >
      {/* Header with action button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}
          >
            Manage Products
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Add, edit, remove, and monitor stock availability for your products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn btn-primary"
          style={{ gap: "8px" }}
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--text-secondary)",
          }}
        >
          Loading products inventory...
        </div>
      ) : products.length > 0 ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        backgroundColor: "var(--bg-color)",
                      }}
                    >
                      <img
                        src={
                          product.image_url ||
                          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&auto=format&fit=crop&q=80"
                        }
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong
                      style={{
                        display: "block",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        lineBreak: "anywhere",
                      }}
                    >
                      {product.name}
                    </strong>
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      ID: {product.id}
                    </span>
                  </td>
                  <td>{product.category}</td>
                  <td style={{ fontWeight: "700", color: "var(--primary)" }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td>{getStockBadge(product.stock)}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "6px 10px" }}
                        title="Edit product"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          padding: "6px 10px",
                          color: "var(--danger)",
                          borderColor: "rgba(239, 68, 68, 0.2)",
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            border: "1px dashed var(--border-color)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <Package
            size={40}
            style={{ color: "var(--text-muted)", marginBottom: "16px" }}
          />
          <h3>No products in database</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Get started by adding your first product.
          </p>
          <Link href="/admin/products/new" className="btn btn-primary">
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
