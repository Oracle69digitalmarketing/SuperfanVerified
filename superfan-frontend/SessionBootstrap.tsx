import { useEffect } from "react";
import { useAbstraxion } from "@burnt-labs/abstraxion-react-native";

export default function SessionBootstrap() {
  const { account, connect, disconnect } = useAbstraxion();

  useEffect(() => {
    console.log("🔗 Current account:", account);

    // Optional: implement auto-connect logic here
    // if (!account) connect();
  }, [account]);

  return null; // no UI, just handles session lifecycle
}
