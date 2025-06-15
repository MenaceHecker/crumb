import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../components/ScreenWrapper'

const Welcome = () => {
  return (
    <ScreenWrapper>
      <Text>Welcome</Text>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({})