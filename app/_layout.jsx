import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserData } from '../services/userService';

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
        const userBasic = session.user;
        const res = await getUserData(userBasic?.id);
        const mergedUser = res.success ? { ...userBasic, ...res.data } : userBasic;
        setAuth(mergedUser);
        setUserData(mergedUser);

        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
          setTimeout(() => {
            router.replace('/(main)/home');
          }, 100);
        }
      } else {
        setAuth(null);
        setUserData(null);
        setTimeout(() => {
          router.replace('/welcome');
        }, 100);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return <Slot />;
};

export default RootLayout;
