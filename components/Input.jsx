import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const Input = (props) => {
  return (
    <View style = {[styles.inputContainer, props.containerStyles && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput
      style ={{flex}}
      />
      </View>
  )
}

export default Input

const styles = StyleSheet.create({})