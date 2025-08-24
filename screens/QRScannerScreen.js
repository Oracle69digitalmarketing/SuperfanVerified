import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  // If you want to extract and pass parameters from scanned deep links
const url = new URL(data);
const screen = url.pathname.replace('/', '');
const params = Object.fromEntries(url.searchParams.entries());
navigation.navigate(screen, params);

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

  const handleBarCodeScanned = ({ type, data }) => {
    Alert.alert(`QR Code Scanned!`, `Type: ${type}\nData: ${data}`);
    setScannedData(data);

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

    // Handle deep link navigation
    try {
      const url = new URL(data);
      const screen = url.pathname.replace('/', '');
      navigation.navigate(screen);
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

export default QRScannerScreen;
