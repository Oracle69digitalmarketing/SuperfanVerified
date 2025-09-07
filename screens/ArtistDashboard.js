import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ArtistCheckInQR from '../components/ArtistCheckInQR';
import { WalletContext } from '../providers/WalletProvider'; // Adjust path as needed

const ArtistDashboard = () => {
  const wallet = useContext(WalletContext);

  // Pull wallet address dynamically
  const userId = wallet?.accounts?.[0] || 'Not connected';
  const eventId = 'E001';
  const referrer = 'artist42';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎤 Artist Dashboard</Text>
      {wallet?.connected ? (
        <ArtistCheckInQR eventId={eventId} userId={userId} referrer={referrer} />
      ) : (
        <Text style={styles.warning}>Please connect your wallet to access your dashboard.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  warning: { fontSize: 16, color: 'red', textAlign: 'center' },
});

export default ArtistDashboard;
