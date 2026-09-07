import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WizardProvider } from "@/features/wizard/wizard-context";
import { useAppFonts } from "@/hooks/use-app-fonts";

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <WizardProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            animation: Platform.OS === "ios" ? "simple_push" : "ios_from_right",
            animationMatchesGesture: true,
            contentStyle: { backgroundColor: "#FDFFFB" },
            fullScreenGestureEnabled: true,
            fullScreenGestureShadowEnabled: false,
            gestureDirection: "horizontal",
            headerShown: false,
            presentation: "card",
          }}
        />
      </WizardProvider>
    </SafeAreaProvider>
  );
}
