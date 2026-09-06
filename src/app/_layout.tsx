import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WizardProvider } from "@/features/wizard/wizard-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WizardProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ animation: "slide_from_right", contentStyle: { backgroundColor: "#FDFFFB" }, headerShown: false }} />
      </WizardProvider>
    </SafeAreaProvider>
  );
}

