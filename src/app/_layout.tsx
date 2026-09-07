import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WizardProvider } from "@/features/wizard/wizard-context";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { useColors } from "@/hooks/use-colors";

export default function RootLayout() {
  const colors = useColors();
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <WizardProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              animation:
                Platform.OS === "ios" ? "simple_push" : "ios_from_right",
              animationMatchesGesture: true,
              contentStyle: { backgroundColor: colors.canvas },
              fullScreenGestureEnabled: true,
              fullScreenGestureShadowEnabled: false,
              gestureDirection: "horizontal",
              headerShown: false,
              presentation: "card",
            }}
          />
        </WizardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
