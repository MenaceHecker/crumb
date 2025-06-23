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
      console.log('session user: ', session?.user?.id);

      if(session) {
        setAuth(session?.user);
        await updateUserData(session?.user);
        // Don't auto-navigate here - let individual components handle navigation
      } else {
        setAuth(null);
        setUserData(null);
        router.replace('/welcome'); 
      }
    });

    // Cleanup function to remove listener
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const updateUserData = async (user) => {
    if (!user?.id) return;
    
    try {
      let res = await getUserData(user.id); // Fixed: was user?.is instead of user.id
      if(res.success) {
        console.log('Profile data fetched successfully:', res.data);
        setUserData({...user, ...res.data}); // Merge auth user with profile data
      } else {
        console.log('Failed to fetch profile data:', res.msg);
        setUserData(user); // Just use auth user data if profile fetch fails
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(user); // Fallback to auth user data
    }
  }
  
  return (
    <Stack
      screenOptions={{ headerShown: false }} 
    />
  )
}

export default _layout