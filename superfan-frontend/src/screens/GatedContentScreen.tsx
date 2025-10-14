import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const GATED_CONTENT_THRESHOLD = 50; // Example threshold

const GatedContentScreen = () => {
  const route = useRoute();
  const { score } = route.params as { score: number };

  const hasAccess = score >= GATED_CONTENT_THRESHOLD;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exclusive Content</Text>
      {hasAccess ? (
        <View>
          <Text style={styles.content}>
            Congratulations! You are a true superfan. Here is some exclusive content for you:
          </Text>
          <Text style={styles.exclusiveContent}>
            🎉 Exclusive Backstage Photo 🎉
          </Text>
        </View>
      ) : (
        <Text style={styles.content}>
          You need a Superfan Score of {GATED_CONTENT_THRESHOLD} or higher to access this content.
          Keep verifying your fan activities to increase your score!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 20,
  },
  exclusiveContent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#facc15',
    textAlign: 'center',
  },
});

export default GatedContentScreen;
