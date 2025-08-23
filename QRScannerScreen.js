import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Handle scanned data
  const handleBarCodeScanned = ({ type, data }) => {
    // You can add a vibration or a sound here to signal a successful scan
    Alert.alert(`QR Code Scanned!`, `Type: ${type}\nData: ${data}`);
    setScannedData(data);

    // Optional: Try to open the scanned data as a URL
    if (data.startsWith('http')) {
      Linking.openURL(data);
    }
  };

  // UI for camera permission status
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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
        // This is the core scanning logic
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // Specify that you only want to scan QR codes [1, 3]
        }}
        onBarcodeScanned={scannedData? undefined : handleBarCodeScanned}
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
