import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CrumbSplashScreen from './splashscreen'; // Assuming splashscreen.jsx is in the same folder

const RootLayout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      console.log('Registering Supabase Auth Listener...');

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log('Auth Event:', _event);

        if (session) {
          const userBasic = session.user;
          setAuth(userBasic);
          setUserData(userBasic);

          if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
            router.replace('/(main)/home');
          }
        } else {
          setAuth(null);
          setUserData(null);
          router.replace('/welcome');
        }

        setIsInitialized(true);
      });

      return () => {
        console.log('Unsubscribing auth listener...');
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [showSplash]);

  if (showSplash) {
    return <CrumbSplashScreen onAnimationFinish={() => setShowSplash(false)} />;
  }

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return <Slot />;
};

export default RootLayout;
