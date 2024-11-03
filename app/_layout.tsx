import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import TheDonkiProvider from "@/context/TheDonkiProvider";
import Toast from "react-native-toast-message";
import DonkiColorProvider from "@/context/DonkiColorProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "splash_screen",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const [loaded, error] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    InterBlack: require("../assets/fonts/Inter-VariableFont.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <TheDonkiProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <DonkiColorProvider>
            <Stack initialRouteName="index">
              <Stack.Screen
                name="index"
                options={{ headerShown: false }}
                listeners={
                  {
                    // focus: () => router.replace("/test"), // Automatically redirect to "test"
                  }
                }
              />
              <Stack.Screen name="homepage" options={{ headerShown: false }} />
              <Stack.Screen
                name="About"
                options={{
                  title: "About",
                  headerTitleStyle: {
                    fontSize: 24, // Increase the font size
                    fontWeight: "bold", // Make the title bold (optional)
                    color: "#FFFFFF", // Set the color to white for better contrast
                  },
                  headerTitle: "About",
                }}
              />
              <Stack.Screen
                name="donate"
                options={{
                  title: "donate",
                  headerTitleStyle: {
                    fontSize: 24, // Increase the font size
                    fontWeight: "bold", // Make the title bold (optional)
                    color: "#FFFFFF", // Set the color to white for better contrast
                  },
                  headerTitle: "Donate",
                }}
              />
            </Stack>
          </DonkiColorProvider>
        </ThemeProvider>
      </TheDonkiProvider>
      <Toast />
    </>
  );
}
