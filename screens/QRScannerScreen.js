import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Create scans table on mount
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          raw_data TEXT,
          scanned_at TEXT
        );`
      );
    });
  }, []);

  // Handle scanned data
  const handleBarCodeScanned = ({ type, data }) => {
    Alert.alert(`QR Code Scanned!`, `Type: ${type}\nData: ${data}`);
    setScannedData(data);

    // Optional: Try to open the scanned data as a URL
    if (data.startsWith('http')) {
      Linking.openURL(data);
    }

    // Save to SQLite
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO scans (raw_data, scanned_at) VALUES (?, datetime("now"));',
        [data],
        (_, result) => {
          console.log('Scan saved to DB:', data);
        },
        (_, error) => {
          console.error('Scan insert error:', error);
        }
      );
    });
  };

  // UI for camera permission status
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // The main scanner UI
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRScannerScreen;  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRScannerScreen;
