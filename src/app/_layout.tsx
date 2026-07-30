import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.replace("/");
    } else {
      router.replace("/(auth)/onboarding");
    }
  }, [isAuth, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}