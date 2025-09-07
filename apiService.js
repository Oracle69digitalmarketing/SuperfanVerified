import { API_URL } from '@env';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fanbase.db');

// 🧱 Ensure table exists
export const initUserTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        referral_code TEXT,
        referred_by TEXT,
        points INTEGER,
        rank INTEGER,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });
};

// 🔧 Run any query
export const runQuery = (query: string, params: any[] = []) =>
  new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });

// 🌐 Fetch users from backend or fallback to local
export const fetchUsers = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();

    // Optionally update local cache
    for (const user of data) {
      await runQuery(
        `INSERT OR REPLACE INTO users (username, email, referral_code, referred_by, points, rank, synced) VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [user.username, user.email, user.referral_code, user.referred_by, user.points || 0, user.rank || 0]
      );
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Backend unavailable, using local DB:', err);
    return runQuery('SELECT * FROM users');
  }
};

// 💾 Save user locally and try syncing
export const saveUser = async (user: any) => {
  await runQuery(
    `INSERT OR REPLACE INTO users (username, email, referral_code, referred_by, points, rank, synced) VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [user.username, user.email, user.referral_code, user.referred_by, user.points || 0, user.rank || 0]
  );

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      await runQuery('UPDATE users SET synced = 1 WHERE username = ?', [user.username]);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to sync ${user.username}:`, err);
  }
};

// 🔄 Sync all unsynced users
export const syncUsers = async () => {
  const unsynced = await runQuery('SELECT * FROM users WHERE synced = 0');

  for (const user of unsynced) {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        await runQuery('UPDATE users SET synced = 1 WHERE username = ?', [user.username]);
      }
    } catch (err) {
      console.warn(`❌ Sync failed for ${user.username}:`, err);
    }
  }
};
