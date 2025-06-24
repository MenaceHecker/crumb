import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {RichToolbar, actions} from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  return (
    <View style={{minHeight:285}}>
      <RichToolbar
        actions={[
                actions.insertImage,
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.keyboard,
                actions.setStrikethrough,
                actions.setUnderline,
                actions.removeFormat,
                actions.insertVideo,
                actions.checkboxList,
                actions.undo,
                actions.redo,
                actions.heading1,
                actions.heading4
        ]}
        iconMap = {{
            [actions.heading1] : ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>,
            [actions.heading1] : ({tintColor}) => <Text style={{color: tintColor}}>H4</Text>
        }}
        style = {styles.richBar}
        flatContainerStyle = {styles.listStyle}
        selectedIconTint = {theme.colors.primaryDark}
        editor={editorRef}
        disabled={false}
        />
        <RichTextEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={"What are be thinking"}
        onChange={onChange}
        />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar : {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray
    }
})