import { View, Text, Button } from 'react-native' 
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router' 
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from '../lib/supabase' 


const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  const {setAuth} = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log ('session user: ', session?.user?.id);

      if(session) {
        setAuth(session?.user);
        router.replace('/home'); // redirect to home if authenticated
      } else {
        setAuth(null);
        router.replace('/welcome'); 
      }
    });
  }, []);
  
  return (
    <Stack
      screenOptions={{ headerShown: false }} 
    />
  )
}

export default _layout