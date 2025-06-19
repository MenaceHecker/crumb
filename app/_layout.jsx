import { View, Text, Button } from 'react-native' 
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router' 
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase' 
import { AuthProvider, useAuth } from '../contexts/AuthContext'



const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  const {setAuth,setUserData} = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log ('session user: ', session?.user?.id);

      if(session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace('/home'); // redirect to home if authenticated
      } else {
        setAuth(null);
        router.replace('/welcome'); 
      }
    });
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.is);
    if(res.success){
      setUserData(res.data);
    }
        }
  
  return (
    <Stack
      screenOptions={{ headerShown: false }} 
    />
  )
}
//Some issue with the code, looking into it
export default _layout