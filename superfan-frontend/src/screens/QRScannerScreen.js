import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../components/WalletProvider'; // Corrected path

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  const { account, xionClient, scans, addScan, refreshScans } = useWallet();

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScannedData(data);
    Alert.alert('QR Code Scanned!', `Data: ${data}`);

    if (!account || !xionClient) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    try {
      // 1. Generate zkTLS proof for the scanned data
      // This is a hypothetical function. The actual implementation will depend on the XION SDK's API.
      const proof = await xionClient.zk.tls.generateProof({
        // We need to define what we are proving here.
        // For a concert ticket, we might be proving the validity of the ticket against a known issuer.
        // For this example, I will just prove the raw data of the QR code.
        data: data,
      });

      // 2. Submit the proof to a smart contract
      const executeMsg = { add_attendance: { proof } }; // This is a hypothetical message
      const result = await xionClient.execute(
        account?.bech32Address,
        process.env.EXPO_PUBLIC_ATTENDANCE_CONTRACT_ADDRESS, // A new contract for attendance
        executeMsg,
        "auto"
      );

      Alert.alert('Attendance Verified!', `Transaction Hash: ${result.transactionHash}`);

      // 3. Save the scan locally (optional, but good for history)
      addScan(data);

    } catch (error) {
      Alert.alert('Error', 'Failed to verify attendance.');
      console.error(error);
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