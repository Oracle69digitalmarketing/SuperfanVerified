import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

// Safe conditional imports
let Camera: any;
let Location: any;

if (Platform.OS !== "web") {
  try {
    Camera = require("expo-camera").Camera;
    Location = require("expo-location");
  } catch (err) {
    console.warn("Native modules failed to load:", err);
  }
}

export default function MainApp() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "web") {
      (async () => {
        try {
          if (Camera) {
            const { status } = await Camera.requestPermissionsAsync();
            setCameraPermission(status === "granted");
          }
          if (Location) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === "granted");
          }
        } catch (error) {
          console.warn("Permission request failed:", error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false); // Web doesn't need permissions
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("./assets/superfan-logo.png")} style={styles.logo} />
        <Text style={styles.splashText}>SUPERFAN VERIFIED</Text>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to SuperfanVerified (Web)</Text>
        <Text style={styles.text}>
          Native features like Camera and Location are disabled.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to SuperfanVerified (Native)</Text>
      {Camera && cameraPermission && <Camera style={styles.camera} />}
      {Location && locationPermission === false && (
        <Text style={styles.text}>Location permission denied!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Dark background for logo contrast
  },
  splashText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00FF88", // Glowing green to match logo
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#ccc",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  camera: {
    width: 300,
    height: 400,
    marginTop: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    resizeMode: "contain",
  },
});
