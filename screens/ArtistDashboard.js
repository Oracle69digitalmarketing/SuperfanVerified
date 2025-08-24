import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ArtistCheckInQR from '../components/ArtistCheckInQR';

const ArtistDashboard = () => {
  // These would normally come from your backend or context
  const eventId = 'E001';
  const userId = '0xABC123';
  const referrer = 'artist42';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎤 Artist Dashboard</Text>
      <ArtistCheckInQR
        eventId={eventId}
        userId={userId}
        referrer={referrer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
});

export default ArtistDashboard;
