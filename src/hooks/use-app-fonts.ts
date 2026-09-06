import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export function useAppFonts() {
  const [loaded, error] = useFonts({
    "Promo-Regular": require("../../assets/fonts/Promo-Regular.ttf"),
    "Promo-Medium": require("../../assets/fonts/Promo-Medium.ttf"),
    "Promo-SemiBold": require("../../assets/fonts/Promo-SemiBold.ttf"),
    "Promo-Bold": require("../../assets/fonts/Promo-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [error, loaded]);

  if (error) throw error;
  return loaded;
}
