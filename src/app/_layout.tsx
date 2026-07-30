import { Stack, useRouter ,useSegments} from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  
  const router = useRouter();
  const segments = useSegments();
  const{user,isLoading,checkSession}=useAuthStore()
    const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";
  
   useEffect(() => {
    checkSession();
  }, [checkSession]);

   useEffect(() => {
    if (isLoading) return;
    if (!user) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else if (!user.onboardingCompleted) {
      if (segments.join("/") !== "(auth)/onboarding") {
        router.replace("/(auth)/onboarding");
      }
    } else {
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [inAuthGroup, inTabsGroup, isLoading, router, segments, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}