import Link from "next/link";
import { queryOne, query } from "@/lib/db";
import AddToCartSection from "@/components/AddToCartSection";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ShieldCheck, HelpCircle, Truck } from "lucide-react";

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product;
  let relatedProducts = [];

  try {
    // Query product by id using raw SQL
    product = await queryOne("SELECT * FROM products WHERE id = ?", [id]);
    if (product) {
      // Query related products in the same category (excluding current) using raw SQL
      relatedProducts = await query(
        "SELECT * FROM products WHERE category = ? AND id != ? LIMIT 3",
        [product.category, product.id],
      );
    }
  } catch (error) {
    console.error("Failed to query product details:", error);
  }

  // 404 - Product not found UI
  if (!product) {
    return (
      <main
        className="section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "16px",
            }}
          >
            Product Not Found
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
            The product you are looking for might have been removed or is
            temporarily unavailable.
          </p>
          <Link href="/products" className="btn btn-primary">
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <main className="section animate-fade">
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
            className="btn-link"
          >
            <ChevronLeft size={16} />
            Back to products catalog
          </Link>
        </div>

        {/* Product Details Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "56px",
            marginBottom: "80px",
          }}
          className="product-detail-layout"
        >
          {/* Product Gallery (Left) */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              aspectRatio: "1/1",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
              }
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Product Information (Right) */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div>
              <span
                className="badge badge-info"
                style={{ marginBottom: "12px" }}
              >
                {product.category}
              </span>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  lineHeight: "1.2",
                }}
              >
                {product.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "var(--primary)",
                  }}
                >
                  ${product.price.toFixed(2)}
                </span>

                {/* Stock Level Tag */}
                {isOutOfStock ? (
                  <span className="badge badge-danger">Out of stock</span>
                ) : isLowStock ? (
                  <span className="badge badge-warning">
                    Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="badge badge-success">
                    In Stock ({product.stock} items)
                  </span>
                )}
              </div>
            </div>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
                lineHeight: "1.7",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "24px",
              }}
            >
              {product.description}
            </p>

            {/* Interactive Add To Cart */}
            <div
              style={{
                padding: "16px 0",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <AddToCartSection product={product} />
            </div>

            {/* Additional Value Trust Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Truck size={16} style={{ color: "var(--primary)" }} />
                <span>Free global delivery on orders above $50.00</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ShieldCheck size={16} style={{ color: "var(--success)" }} />
                <span>Secure checkouts with standard 256-bit encryption</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <HelpCircle size={16} style={{ color: "var(--text-muted)" }} />
                <span>Need support? Contact our 24/7 help desk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical specifications */}
        <section
          style={{
            marginBottom: "80px",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "56px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            Specifications & Details
          </h2>
          <div
            className="card"
            style={{ maxWidth: "700px", padding: "0", overflow: "hidden" }}
          >
            <table className="custom-table" style={{ fontSize: "14px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      fontWeight: "700",
                      width: "200px",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Brand Reference
                  </td>
                  <td>NextCommerce Select Line</td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "700",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Model Identifier
                  </td>
                  <td>{product.id}</td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "700",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Category Division
                  </td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "700",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Quality Standard
                  </td>
                  <td>Premium Grade certified</td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "700",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Warranty Period
                  </td>
                  <td>1 Year limited manufacturer warranty</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "56px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                marginBottom: "32px",
              }}
            >
              You May Also Like
            </h2>
            <div className="grid-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .product-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </main>
  );
}
