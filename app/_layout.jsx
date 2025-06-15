import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
    screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
    />
  )
}

export default _layout