import React from 'react';
import { View, Text } from 'react-native';

export default function AppNavigator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: '#58a6ff' }}>✅ App Loaded Successfully</Text>
    </View>
  );
}
