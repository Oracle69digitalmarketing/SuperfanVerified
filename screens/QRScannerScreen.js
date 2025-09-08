import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { WalletContext } from '../providers/WalletProvider';
import Constants from 'expo-constants';

const db = SQLite.openDatabase('my-database.db');
const API_URL = Constants.expoConfig.extra.apiUrl; // 👈 from app.config.js

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const wallet = useContext(WalletContext);
  const walletAddress = wallet?.accounts?.[0] || 'Unknown';

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          raw_data TEXT,
          scanned_at TEXT,
          scanned_by TEXT,
          status TEXT
        );`
      );
    });
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    Alert.alert(`QR Code Scanned!`, `Type: ${type}\nData: ${data}`);
    setScannedData(data);

    // 1️⃣ Save to SQLite first (status = "pending")
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO scans (raw_data, scanned_at, scanned_by, status) VALUES (?, datetime("now"), ?, ?);',
        [data, walletAddress, "pending"],
        () => console.log('Scan saved locally:', data),
        (_, error) => console.error('Scan insert error:', error)
      );
    });

    // 2️⃣ Send to backend
    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: data,
          wallet: walletAddress,
        }),
      });
      const result = await res.json();
      console.log('✅ Backend verified:', result);

      // 3️⃣ Update SQLite with backend status
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE scans SET status = ? WHERE raw_data = ?;',
          [result.status || "verified", data],
          () => console.log('SQLite updated with status:', result.status),
          (_, error) => console.error('SQLite update error:', error)
        );
      });
    } catch (err) {
      console.error('❌ Backend error:', err);
    }

    // 4️⃣ Optional deep link navigation
    try {
      const url = new URL(data);
      const screen = url.pathname.replace('/', '');
      const params = Object.fromEntries(url.searchParams.entries());
      navigation.navigate(screen, params);
    } catch (error) {
      if (data.startsWith('http')) {
        Linking.openURL(data);
      } else {
        console.warn('Not a valid deep link or URL:', data);
      }
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
      />
      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Last Scanned: {scannedData}</Text>
          <Button title="Scan Again" onPress={() => setScannedData(null)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  text: { fontSize: 20, fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  overlayText: { color: '#fff', fontSize: 16, marginBottom: 10 },
});

export default QRScannerScreen;
