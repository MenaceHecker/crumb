import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { getUserData } from '../services/userService'

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth Event:', _event);
      console.log('Session User ID:', session?.user?.id);

      if (session) {
        const userBasic = session.user;
        const res = await getUserData(userBasic?.id);

        if (res.success && res.data) {
          const mergedUser = {
            ...userBasic,
            ...res.data,
          };
          setAuth(mergedUser);
          setUserData(mergedUser);
        } else {
          console.error('Error fetching user profile from DB:', res.error?.message || 'No profile data found');
          setAuth(userBasic);
        }

        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
             console.log('Navigating to /home due to event:', _event);
             router.replace('/home');
        }
      } else {
        setAuth(null);
        setUserData(null);
        console.log('Navigating to /welcome due to logout/no session');
        router.replace('/welcome');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout