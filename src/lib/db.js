import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

let dbInstance = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.join(process.cwd(), "db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, "ecommerce.sqlite");
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await dbInstance.exec("PRAGMA foreign_keys = ON;");
  return dbInstance;
}

export async function query(sql, params = []) {
  const db = await getDb();
  return db.all(sql, params);
}

export async function queryOne(sql, params = []) {
  const db = await getDb();
  return db.get(sql, params);
}

export async function execute(sql, params = []) {
  const db = await getDb();
  const result = await db.run(sql, params);
  return {
    lastID: result.lastID,
    changes: result.changes,
  };
}

export async function transaction(callback) {
  const db = await getDb();
  await db.exec("BEGIN TRANSACTION");
  try {
    const result = await callback(db);
    await db.exec("COMMIT");
    return result;
  } catch (error) {
    await db.exec("ROLLBACK");
    throw error;
  }
}
