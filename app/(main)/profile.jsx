import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import BackButton from '../../components/BackButton'


const Profile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  return (
    <ScreenWrapper bg='white'>
      <UserHeader user = {user} router = {router}/>
    </ScreenWrapper>
  )
}
const UserHeader = ({user, router}) => {
  return (
    <View style = {{flex:1, backgroundColor: 'white'}}>
      <View>
        <Header title="Profile" showBackButton = {true}/>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})