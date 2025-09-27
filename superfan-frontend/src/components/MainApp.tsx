import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet } from "react-native";

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

  useEffect(() => {
    if (Platform.OS !== "web") {
      (async () => {
        if (Camera) {
          const { status } = await Camera.requestPermissionsAsync();
          setCameraPermission(status === "granted");
        }
        if (Location) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setLocationPermission(status === "granted");
        }
      })();
    }
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to SuperfanVerified (Web)</Text>
        <Text style={styles.text}>Native features like Camera and Location are disabled.</Text>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  text: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  camera: { width: 300, height: 400, marginTop: 20 },
});
