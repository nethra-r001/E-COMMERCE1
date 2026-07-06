import { query } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Suspense } from "react";

export const revalidate = 0;

export default async function ProductsPage({ searchParams }) {
  // Fetch distinct categories dynamically from the DB using raw SQL
  let categories = [];
  try {
    const cats = await query(
      "SELECT DISTINCT category FROM products ORDER BY category ASC",
    );
    categories = cats.map((c) => c.category);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  // Parse search parameters
  const sp = await searchParams;
  const search = sp.search || "";
  const category = sp.category || "";
  const minPrice = parseFloat(sp.minPrice || "0") || 0;
  const maxPrice = parseFloat(sp.maxPrice || "100000") || 100000;
  const sort = sp.sort || "newest";

  // Build raw SQL query based on filters
  let sql = "SELECT * FROM products WHERE price >= ? AND price <= ?";
  const params = [minPrice, maxPrice];

  if (category && category !== "All") {
    sql += " AND category = ?";
    params.push(category);
  }

  if (search) {
    sql += " AND (name LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  // Handle SQL sorting
  if (sort === "price_asc") {
    sql += " ORDER BY price ASC";
  } else if (sort === "price_desc") {
    sql += " ORDER BY price DESC";
  } else {
    sql += " ORDER BY created_at DESC";
  }

  let products = [];
  try {
    products = await query(sql, params);
  } catch (error) {
    console.error("Failed to query products:", error);
  }

  return (
    <main className="section" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{ fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}
          >
            Store Catalog
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Browse through our premium selection of tech, apparel, and fitness
            gear.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "40px",
          }}
          className="catalog-layout"
        >
          {/* Sidebar Filters */}
          <aside
            style={{ position: "sticky", top: "96px", height: "fit-content" }}
          >
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          {/* Catalog Grid */}
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-secondary)",
                }}
              >
                Showing {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid-3" style={{ gap: "24px" }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  No products match your filters
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                  Try resetting your filters or adjusting your keywords.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Responsive layout styles helper */}
      <style>{`
        @media (max-width: 900px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </main>
  );
}
