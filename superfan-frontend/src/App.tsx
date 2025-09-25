import React from "react";
import { registerRootComponent } from "expo";
import MainApp from "./MainApp";

// Keep App.tsx minimal – just load MainApp
export default function App() {
  return <MainApp />;
}

registerRootComponent(App);
