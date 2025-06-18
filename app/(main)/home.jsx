import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonGen from '../../components/ButtonGen'
import { useAuth } from '../contexts/AuthContext'
import ScreenWrapper from '../../components/ScreenWrapper'


const Home = () => {
    const {setAuth} = useAuth();
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