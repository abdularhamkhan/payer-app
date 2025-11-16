import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => { })

export default function RootLayout() {

  // useEffect(()=>{
  //   SplashScreen.hideAsync()
  // },[])

  useEffect(() => {
    // replace this with real readiness check (fonts, assets, auth, etc.)
    const ready = async () => {
      // wait a small delay to show splash route if desired
      await new Promise((r) => setTimeout(r, 800));
      await SplashScreen.hideAsync().catch(() => { });
    };
    ready();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  )
}
