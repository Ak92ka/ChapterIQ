import Database from "better-sqlite3";

const db = new Database("database.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    subscribed INTEGER DEFAULT 0,
    subscribedAt TEXT,
    dailyCharacters INTEGER DEFAULT 0,
    dailyReset TEXT,
    monthlyCharacters INTEGER DEFAULT 0,
    monthlyReset TEXT
  )
`);

export default db;
