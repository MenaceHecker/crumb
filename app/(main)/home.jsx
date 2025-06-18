import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonGen from '../../components/ButtonGen'
import ScreenWrapper from '../../components/ScreenWrapper'
import { supabase } from '../../lib/supabase'
import { useAuth } from "../../contexts/AuthContext"  

//Had dual imports of Auth here

const Home = () => {
    const {user, setAuth} = useAuth();
    console.log('Home user: ', user);

    const onLogout = async () => {
        //setAuth(null);
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', error.message);
        }
    }

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <ButtonGen title='Logout' onPress={onLogout} />
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})