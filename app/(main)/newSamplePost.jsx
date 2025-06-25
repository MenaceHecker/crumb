import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NewSamplePost = () => {
  return (
     <View style={styles.container}>
      <Text style={styles.text}>New Post Screen - Test</Text>
    </View>
  )
}

export default NewSamplePost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'black',
  }
});