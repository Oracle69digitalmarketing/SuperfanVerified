import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WalletContext } from '../providers/WalletProvider';
import Constants from 'expo-constants';
import ArtistCheckInQR from '../components/ArtistCheckInQR';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const ArtistDashboard = () => {
  const wallet = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [checkInCode, setCheckInCode] = useState<string | null>(null);

  const userId = wallet?.accounts?.[0] || 'Not connected';
  const eventId = 'E001';
  const referrer = 'artist42';

  const handleGenerateCheckIn = async () => {
    if (!wallet?.connected || !wallet?.accounts?.[0]) {
      Alert.alert("Wallet Required", "Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/artist/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId: wallet.accounts[0],
          referrer,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCheckInCode(data.checkInCode || `${eventId}-${userId}`);
        Alert.alert("✅ QR Ready", "Your check-in QR is generated.");
      } else {
        Alert.alert("❌ Error", data.message || "Failed to generate check-in.");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      Alert.alert("Error", "Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎤 Artist Dashboard</Text>

      {wallet?.connected ? (
        <>
          <TouchableOpacity style={styles.button} onPress={handleGenerateCheckIn}>
            {loading ? (
              <ActivityIndicator color="#facc15" />
            ) : (
              <Text style={styles.buttonText}>📲 Generate Check-In QR</Text>
            )}
          </TouchableOpacity>

          {checkInCode && (
            <ArtistCheckInQR
              eventId={eventId}
              userId={userId}
              referrer={referrer}
            />
          )}
        </>
      ) : (
        <Text style={styles.warning}>
          Please connect your wallet to access your dashboard.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#facc15' },
  button: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#f8fafc', fontSize: 18 },
  warning: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ArtistDashboard;
