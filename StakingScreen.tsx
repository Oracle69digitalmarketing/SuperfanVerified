import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const validators = [
  { id: '1', name: 'Validator One', apr: '12.5%', commission: '5%' },
  { id: '2', name: 'Validator Two', apr: '10.2%', commission: '3%' },
  { id: '3', name: 'Validator Three', apr: '8.9%', commission: '2%' },
];

const StakingScreen = () => {
  const [selectedValidator, setSelectedValidator] = useState(null);
  const [amount, setAmount] = useState('');

  const handleStake = () => {
    // TODO: Connect to blockchain and stake
    alert(`Staked ${amount} to ${selectedValidator.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 Stake Your Tokens</Text>

      <FlatList
        data={validators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.validatorCard,
              selectedValidator?.id === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedValidator(item)}
          >
            <Text style={styles.validatorName}>{item.name}</Text>
            <Text style={styles.validatorDetails}>APR: {item.apr} | Commission: {item.commission}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedValidator && (
        <View style={styles.stakeSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount to stake"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.stakeButton} onPress={handleStake}>
            <Text style={styles.stakeButtonText}>Confirm Stake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  validatorCard: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: '#facc15',
    borderWidth: 2,
  },
  validatorName: {
    fontSize: 18,
    color: '#f8fafc',
  },
  validatorDetails: {
    fontSize: 14,
    color: '#94a3b8',
  },
  stakeSection: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#334155',
    color: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  stakeButton: {
    backgroundColor: '#facc15',
    padding: 15,
    borderRadius: 10,
  },
  stakeButtonText: {
    color: '#0f172a',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default StakingScreen;
