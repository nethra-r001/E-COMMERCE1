import { NextResponse } from "next/server";
import { execute, query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const revalidate = 0;

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query all products ordered by created_at DESC
    const products = await query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const productId = `p-${crypto.randomUUID()}`;

    // Save product to database using raw SQL
    await execute(
      `INSERT INTO products (id, name, description, price, stock, image_url, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        name,
        description,
        parseFloat(price),
        parseInt(stock),
        imageUrl || "",
        category,
      ],
    );

    return NextResponse.json(
      {
        productId,
        message: "Product created successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin product create error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
