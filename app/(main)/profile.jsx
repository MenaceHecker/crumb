import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import {useRouter} from 'expo-router'

const Profile = () => {
  const {user, setAuth} = useAuth();

  return (
    <ScreenWrapper>


    </ScreenWrapper>>
  )
}

export default Profile

const styles = StyleSheet.create({})