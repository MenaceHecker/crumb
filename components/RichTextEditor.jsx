import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
    editorRef,
    onChange,
    placeholder = "What are you thinking?",
    initialContent = ""
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
          actions.insertOrderedList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.undo,
          actions.redo,
        ]}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={theme.colors.primaryDark}
        iconTint={theme.colors.textLight}
        editor={editorRef || richText}
        disabled={false}
      />
      <RichEditor
        ref={editorRef || richText}
        style={styles.rich}
        placeholder={placeholder}
        onChange={(text) => {
          if (onChange) {
            // Ensure we always pass a string and handle null/undefined
            const content = text || '';
            onChange(String(content));
          }
        }}
        initialContentHTML={initialContent}
        editorStyle={styles.contentStyle}
        androidHardwareAccelerationDisabled={true}
        // Additional props for better performance and UX
        onScroll={() => {}}
        onFocus={() => console.log('RichEditor focused')}
        onBlur={() => console.log('RichEditor blurred')}
        // Prevent keyboard issues
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
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
    height: 50,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    backgroundColor: 'white',
    padding: 5,
  },
  contentStyle: {
    backgroundColor: 'white',
    color: theme.colors.textDark,
    placeholderColor: theme.colors.textLight,
    fontSize: '16px',
    fontFamily: 'System',
    padding: '12px',
    minHeight: '200px',
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
    alignItems: 'center',
  }
})