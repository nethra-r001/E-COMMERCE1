import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.join(process.cwd(), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'ecommerce.sqlite');
  
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  
  return dbInstance;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  return db.all<T[]>(sql, params);
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = await getDb();
  return db.get<T>(sql, params);
}

export async function execute(sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
  const db = await getDb();
  const result = await db.run(sql, params);
  return {
    lastID: result.lastID,
    changes: result.changes
  };
}

export async function transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
  const db = await getDb();
  await db.exec('BEGIN TRANSACTION');
  try {
    const result = await callback(db);
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}
