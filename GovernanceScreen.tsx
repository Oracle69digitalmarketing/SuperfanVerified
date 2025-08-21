import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StargateClient } from '@cosmjs/stargate';

export default function GovernanceScreen() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const client = await StargateClient.connect('https://rpc.cosmos.network'); // Replace with your chain's RPC
        const allProposals = await client.getProposals(); // May vary by chain
        const formatted = allProposals.map((p) => ({
          id: p.proposalId.toString(),
          title: p.content?.title || 'Untitled',
          status: p.status,
          endDate: p.votingEnd?.toISOString().split('T')[0] || 'Unknown',
        }));
        setProposals(formatted);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, []);

  const handleVote = (id: string) => {
    Alert.alert('Vote Submitted', `You voted YES on Proposal #${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗳️ Governance Proposals</Text>
      <FlatList
        data={proposals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.proposalTitle}>{item.title}</Text>
            <Text style={styles.details}>Status: {item.status}</Text>
            <Text style={styles.details}>Voting Ends: {item.endDate}</Text>
            {item.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
              <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item.id)}>
                <Text style={styles.voteText}>Vote YES</Text>
              </TouchableOpacity>
            )}
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
    marginBottom: 20,
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
  voteButton: {
    backgroundColor: '#facc15',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  voteText: {
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
