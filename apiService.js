import { API_URL } from '@env';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fanbase.db');

export const runQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });

export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error('Backend error');
    return await res.json();
  } catch {
    return runQuery('SELECT * FROM users');
  }
};

export const saveUser = async user => {
  await runQuery(
    `INSERT OR IGNORE INTO users (username, email, referral_code, referred_by, points, rank) VALUES (?, ?, ?, ?, ?, ?)`,
    [user.username, user.email, user.referral_code, user.referred_by, user.points || 0, user.rank || 0]
  );

  try {
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  } catch {
    console.warn('Saved locally; backend unavailable.');
  }
};
