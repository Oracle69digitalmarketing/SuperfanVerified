import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../providers/WalletProvider';

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  const { wallet, scans, addScan, refreshScans } = useWallet();

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    Alert.alert('QR Code Scanned!', `Type: ${type}\nData: ${data}`);
    setScannedData(data);

    // Save + sync
    addScan(data);

    // Optional: deep link navigation
    try {
      const url = new URL(data);
      const screen = url.pathname.replace('/', '');
      const params = Object.fromEntries(url.searchParams.entries());
      navigation.navigate(screen as never, params as never);
    } catch (error) {
      console.log('Not a deep link, ignoring…');
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
      {/* Camera Scanner */}
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
      />

      {/* Overlay after scan */}
      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Last Scanned: {scannedData}</Text>
          <Button title="Scan Again" onPress={() => setScannedData(null)} />
        </View>
      )}

      {/* Scan History */}
      <View style={styles.history}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Scan History</Text>
          <Button title="Refresh" onPress={refreshScans} />
        </View>
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ScanDetails' as never, { id: item.id } as never)
              }
            >
              <View style={styles.scanRow}>
                <Text style={styles.scanText}>{item.raw_data}</Text>
                <Text style={styles.scanStatus}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, width: '100%' },
  text: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  overlayText: { color: '#fff', fontSize: 16, marginBottom: 10 },
  history: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  historyTitle: { fontSize: 20, fontWeight: '700' },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  scanText: { flex: 1, fontSize: 14 },
  scanStatus: { fontSize: 14, fontWeight: '600', color: '#007BFF' },
});

export default QRScannerScreen;
