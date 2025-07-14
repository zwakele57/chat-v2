import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Add delay to ensure navigation context is ready
      const timer = setTimeout(() => {
        if (!user) {
          router.replace('/auth/login');
        } else {
          router.replace('/(tabs)');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}