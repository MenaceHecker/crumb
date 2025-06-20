import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import {useAuth} from '../hooks/useAuth'


const Profile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  return (
    <ScreenWrapper>

      <Text>Profile</Text>
    </ScreenWrapper>>
  )
}

export default Profile

const styles = StyleSheet.create({})