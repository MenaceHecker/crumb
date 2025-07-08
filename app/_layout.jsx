import { Slot, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    console.log('Registering Supabase Auth Listener...');

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth Event:', _event);

      if (session) {
        console.log('Session exists, using basic user data...');
        const userBasic = session.user;
        
        // Skip getUserData for now to test if navigation works
        setAuth(userBasic);
        setUserData(userBasic);

        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
          console.log('Navigating to home...');
          setTimeout(() => {
            router.replace('/(main)/home');
          }, 100);
        }
      } else {
        console.log('No session, clearing auth...');
        setAuth(null);
        setUserData(null);
        setTimeout(() => {
          router.replace('/welcome');
        }, 100);
      }
    });

    return () => {
      <Stack
        screenOptions={{
          headerShown: false
        }}
        >
          <Stack.Screen
            name="(main)/postDetails"
            options = {{
              presentation: 'modal',
            }}
            />
        </Stack>
      console.log('Unsubscribing auth listener...');
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return <Slot />;
};

export default RootLayout;