import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await queryOne("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Admin product fetch by ID error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, price, stock, imageUrl, category } =
      await req.json();

    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      return NextResponse.json(
        { error: "Name, description, price, stock, and category are required" },
        { status: 400 },
      );
    }

    // Update product using raw SQL
    const result = await execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category = ? 
       WHERE id = ?`,
      [
        name,
        description,
        parseFloat(price),
        parseInt(stock),
        imageUrl || "",
        category,
        id,
      ],
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete product using raw SQL
    const result = await execute("DELETE FROM products WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
