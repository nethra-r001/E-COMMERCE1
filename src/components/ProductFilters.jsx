"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

export default function ProductFilters({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialized from URL query params
  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [category, setCategory] = useState(
    searchParams?.get("category") || "All",
  );
  const [minPrice, setMinPrice] = useState(searchParams?.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams?.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams?.get("sort") || "newest");

  // Sync state with URL params changes (e.g. back button)
  useEffect(() => {
    setSearch(searchParams?.get("search") || "");
    setCategory(searchParams?.get("category") || "All");
    setMinPrice(searchParams?.get("minPrice") || "");
    setMaxPrice(searchParams?.get("maxPrice") || "");
    setSort(searchParams?.get("sort") || "newest");
  }, [searchParams]);

  const applyFilters = (updatedCategory = category, updatedSort = sort) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (updatedCategory && updatedCategory !== "All")
      params.set("category", updatedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (updatedSort && updatedSort !== "newest")
      params.set("sort", updatedSort);

    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    router.push("/products");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Search Input */}
      <div>
        <h4
          style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px" }}
        >
          Search Products
        </h4>
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", position: "relative" }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Type keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: "44px" }}
          />

          <button
            type="submit"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Category Buttons */}
      <div>
        <h4
          style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}
        >
          Categories
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["All", ...categories].map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  applyFilters(cat, sort);
                }}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border:
                    "1px solid " +
                    (isActive ? "var(--primary)" : "var(--border-color)"),
                  background: isActive
                    ? "var(--primary-glow)"
                    : "var(--bg-surface)",
                  color: isActive ? "var(--primary)" : "var(--text-primary)",
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4
          style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}
        >
          Price Range
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <input
            type="number"
            className="form-input"
            placeholder="Min ($)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px" }}
          />

          <span style={{ color: "var(--text-muted)" }}>-</span>
          <input
            type="number"
            className="form-input"
            placeholder="Max ($)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px" }}
          />
        </div>
        <button
          onClick={() => applyFilters()}
          className="btn btn-secondary btn-sm"
          style={{ width: "100%" }}
        >
          Apply Price
        </button>
      </div>

      {/* Sort Filter */}
      <div>
        <h4
          style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px" }}
        >
          Sort By
        </h4>
        <select
          className="form-input form-select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters(category, e.target.value);
          }}
          style={{ fontSize: "13px", padding: "10px 14px" }}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={handleReset}
        className="btn btn-secondary"
        style={{
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <RotateCcw size={15} />
        Reset Filters
      </button>
    </div>
  );
}
