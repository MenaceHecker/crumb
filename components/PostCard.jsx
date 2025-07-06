import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {hp, wp} from '../helpers/common'
import { theme } from '../theme/theme'

const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpactiy: 0.06,
    shadowRadius: 6,
    elevation: 1
    }
  return (
    <View>
      <Text>PostCard</Text>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  }
})