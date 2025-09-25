import * as SQLite from "expo-sqlite";
import * as Sentry from "sentry-expo";

const db = SQLite.openDatabase("fanbase.db");

// --- Setup database & tables ---
export const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        points INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log("✅ users table ready"),
      (_, error) => {
        console.error("❌ users table error:", error);
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

// --- Debug utility ---
export const fetchUsers = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM users;",
      [],
      (_, { rows }) => console.log("Users:", rows._array),
      (_, error) => {
        console.error("❌ fetchUsers error:", error);
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

export default db;
