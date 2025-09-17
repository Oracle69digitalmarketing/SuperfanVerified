import * as Network from 'expo-network';
import * as Crypto from 'expo-crypto';
import Toast from 'react-native-toast-message';
import { db } from './db'; // Your local DB instance

// 🔐 Encrypt sensitive fields
export const encryptField = async (value: string): Promise<string> => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
};

// 🌐 Check network status
export const isOnline = async (): Promise<boolean> => {
  const status = await Network.getNetworkStateAsync();
  return status.isConnected && status.isInternetReachable;
};

// 🔁 Retry queue helpers
export const getPendingSyncs = async () => {
  return await db.get('sync_queue').query().fetch();
};

export const saveToQueue = async (payload: any, endpoint: string) => {
  await db.get('sync_queue').create(record => {
    record.payload = JSON.stringify(payload);
    record.endpoint = endpoint;
    record.retries = 0;
    record.lastAttempt = new Date().toISOString();
  });
};

export const removeFromQueue = async (id: string) => {
  const record = await db.get('sync_queue').find(id);
  await record.destroyPermanently();
};

export const updateRetryCount = async (id: string) => {
  const record = await db.get('sync_queue').find(id);
  await record.update(r => {
    r.retries += 1;
    r.lastAttempt = new Date().toISOString();
  });
};

// 📡 Send to server
export const sendToServer = async (endpoint: string, payload: any) => {
  const res = await fetch(`https://your-api.com${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Sync failed');
  return await res.json();
};

// 🔄 Sync users with encryption
export const syncUsers = async () => {
  const online = await isOnline();
  if (!online) {
    Toast.show({ type: 'error', text1: 'Offline. Sync skipped.' });
    return;
  }

  const users = await db.get('users').query().fetch();
  const unsynced = users.filter(u => !u.synced);

  for (const user of unsynced) {
    try {
      const encryptedEmail = await encryptField(user.email);
      const payload = { ...user, email: encryptedEmail };

      await sendToServer('/users', payload);
      await user.update(u => { u.synced = true });
    } catch {
      await saveToQueue(user, '/users');
    }
  }

  Toast.show({ type: 'success', text1: 'Users synced successfully' });
};

// 🔁 Retry failed syncs with exponential backoff
export const retrySyncQueue = async () => {
  const queue = await getPendingSyncs();

  for (const item of queue) {
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    if (item.retries >= maxRetries) {
      console.warn(`Max retries reached for item ${item.id}`);
      continue;
    }

    const delay = Math.pow(2, item.retries) * baseDelay;
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const payload = JSON.parse(item.payload);
      await sendToServer(item.endpoint, payload);
      await removeFromQueue(item.id);
    } catch {
      await updateRetryCount(item.id);
    }
  }
};

// 📊 Sync dashboard metrics
export const fetchSyncStats = async () => {
  const users = await db.get('users').query().fetch();
  const totalUsers = users.length;
  const syncedUsers = users.filter(u => u.synced).length;
  const pendingSyncs = (await getPendingSyncs()).length;

  return {
    totalUsers,
    syncedUsers,
    pendingSyncs,
    lastSyncTime: new Date().toLocaleTimeString(),
    failuresToday: pendingSyncs, // simple proxy
  };
};

// 🧭 Manual sync trigger
export const manualSync = async () => {
  await syncUsers();
  await retrySyncQueue();
};
