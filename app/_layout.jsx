import { View, Text, Button } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const _layout = () => {
  return (
    <Stack
    screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
    />
  )
}

export default _layout