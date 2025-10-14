import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { useWallet } from '../components/WalletProvider';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function GovernanceScreen() {
  const [proposals, setProposals] = useState([]);
  const { account } = useWallet();
  const walletAddress = account?.bech32Address;

  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');

  const fetchProposals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/governance/proposals`);
      const data = await res.json();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleVote = async (proposalId: string, vote: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/governance/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Vote Submitted', `You voted ${vote ? 'YES' : 'NO'} on Proposal #${proposalId}`);
        fetchProposals(); // Refresh the list of proposals
      } else {
        throw new Error(data.error || 'Failed to vote');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCreateProposal = async () => {
    try {
      const res = await fetch(`${API_URL}/api/governance/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newProposalTitle, description: newProposalDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Proposal Created', 'Your proposal has been created.');
        setNewProposalTitle('');
        setNewProposalDescription('');
        fetchProposals(); // Refresh the list of proposals
      } else {
        throw new Error(data.error || 'Failed to create proposal');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗳️ Governance Proposals</Text>
      <Text style={styles.meta}>Connected Wallet: {walletAddress || 'Not connected'}</Text>

      <View style={styles.createProposalContainer}>
        <Text style={styles.subtitle}>Create a New Proposal</Text>
        <TextInput
          style={styles.input}
          placeholder="Proposal Title"
          value={newProposalTitle}
          onChangeText={setNewProposalTitle}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Proposal Description"
          value={newProposalDescription}
          onChangeText={setNewProposalDescription}
          multiline
        />
        <Button title="Create Proposal" onPress={handleCreateProposal} disabled={!walletAddress} />
      </View>

      <FlatList
        data={proposals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.proposalTitle}>{item.title}</Text>
            <Text style={styles.details}>Proposer: {item.proposer.walletAddress}</Text>
            <Text style={styles.details}>Yes Votes: {item.yesVotes}</Text>
            <Text style={styles.details}>No Votes: {item.noVotes}</Text>
            <View style={styles.voteButtons}>
              <Button title="Vote Yes" onPress={() => handleVote(item._id, true)} disabled={!walletAddress} />
              <Button title="Vote No" onPress={() => handleVote(item._id, false)} disabled={!walletAddress} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  createProposalContainer: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  proposalTitle: {
    fontSize: 18,
    color: '#f8fafc',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#94a3b8',
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});