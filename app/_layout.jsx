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
      console.log ('session user: ', session?.user);

      if(session) {
        // set auth
        //move to home screen
      } else {
        //set auth null
        //moving to welcome screen
      }
    });
    return () => {
      authListener.unsubscribe();
    };
  }, []);
  return (
    <Stack
      screenOptions={{ headerShown: false }} 
    />
  )
}

export default _layout