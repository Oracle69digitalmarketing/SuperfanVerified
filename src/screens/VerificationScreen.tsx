import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import SpotifyAuth from '../SpotifyAuth';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = () => {
  const [verifying, setVerifying] = useState(false);
  const navigation = useNavigation();

  const handleVerified = async (artistName: string, fullData: any, proof: any, txHash: string) => {
    setVerifying(true);

    try {
      // Save proof locally or pass to next screen
      navigation.navigate('ScoreScreen' as never, {
        artistName,
        proof,
        txHash,
        fullData,
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to process verification.');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 Verify Your Superfan Status</Text>
      {verifying ? (
        <ActivityIndicator size="large" color="#facc15" />
      ) : (
        <SpotifyAuth onVerified={handleVerified} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, color: '#facc15', marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
});

export default VerificationScreen;
