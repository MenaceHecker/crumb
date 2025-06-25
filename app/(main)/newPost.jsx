import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'

const NewPost = () => {
  console.log('NewPost component rendered');
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post - Test</Text>
      <Text>Loading: {loading.toString()}</Text>
      <Text>File: {file ? 'Has file' : 'No file'}</Text>
    </View>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
})