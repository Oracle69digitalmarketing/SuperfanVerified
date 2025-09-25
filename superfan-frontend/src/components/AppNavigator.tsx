import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WalletContext } from "./providers/WalletProvider";

// Screens
import HomeScreen from "./screens/HomeScreen";
import WalletScreen from "./screens/WalletScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ArtistDashboard from "./screens/ArtistDashboard";
import QRScannerScreen from "./screens/QRScannerScreen";
import ScansScreen from "./screens/ScansScreen";
import UsersScreen from "./screens/UsersScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import VotingHistoryScreen from "./screens/VotingHistoryScreen";
import EventCheckInScreen from "./screens/EventCheckInScreen";
import StakingScreen from "./screens/StakingScreen";
import GovernanceScreen from "./screens/GovernanceScreen";

// 🆕 Checkpoint 2
import VerificationScreen from "./screens/VerificationScreen";
import ScoreScreen from "./screens/ScoreScreen";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["superfanverified://"],
  config: {
    screens: {
      Home: "home",
      Wallet: "wallet",
      Dashboard: "dashboard",
      ArtistDashboard: "artist",
      QRScanner: "scan",
      Scans: "scans",
      Users: "users",
      LeaderboardScreen: "leaderboard",
      VotingHistory: "voting",
      EventCheckIn: "event",
      Staking: "staking",
      Governance: "governance",
      VerificationScreen: "verify", // 🆕
      ScoreScreen: "score",         // 🆕
    },
  },
};

export default function AppNavigator() {
  const wallet = useContext(WalletContext);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={wallet?.connected ? "Home" : "Wallet"}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ArtistDashboard" component={ArtistDashboard} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Scans" component={ScansScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
        <Stack.Screen name="VotingHistory" component={VotingHistoryScreen} />
        <Stack.Screen name="EventCheckIn" component={EventCheckInScreen} />
        <Stack.Screen name="Staking" component={StakingScreen} />
        <Stack.Screen name="Governance" component={GovernanceScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} /> {/* 🆕 */}
        <Stack.Screen name="ScoreScreen" component={ScoreScreen} />               {/* 🆕 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
