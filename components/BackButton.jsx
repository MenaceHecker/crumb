import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const BackButton = ({size = 26, router}) => {
  return (
    <Pressable onPress={() => router.goBack()} style={styles.button}>
      <Icon name="arrow-left" size={size} strokeWidth = {2.5} color={theme.color.text} />
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)',
    }
})