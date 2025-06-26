import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import {RichToolbar, RichEditor, actions} from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  const richText = useRef();

  return (
    <View style={{minHeight: 285}}>
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.undo,
          actions.redo,
        ]}
        style={styles.richBar}
        selectedIconTint={theme.colors.primaryDark}
        editor={editorRef || richText}
      />
      <RichEditor
        ref={editorRef || richText}
        style={styles.rich}
        placeholder="What are you thinking?"
        onChange={(text) => {
          if (onChange) {
            onChange(String(text || ''));
          }
        }}
        initialContentHTML=""
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    backgroundColor: 'white',
  }
})