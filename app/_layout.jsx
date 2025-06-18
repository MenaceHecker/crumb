import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthProvider } from './contexts/AuthContext'


const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}


const MainLayout = () => {
  const {setAuth} = useAuth();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log ('session user: ', session?.user);
    })
  return (
    <Stack
    screenOptions={{ headerShown: false}}
    />
  )
}

export default _layout

//There is still error in the code