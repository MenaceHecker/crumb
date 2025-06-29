import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { theme } from '../constants/theme';

const RNRichTextEditor = ({
  editorRef,
  onChange,
  placeholder = "What are you thinking?",
  initialContent = ""
}) => {
  const richText = useRef(null);
  const editorInstance = editorRef || richText;

  return (
    <View style={styles.container}>
      <RichToolbar
        style={styles.richBar}
        editor={editorInstance}
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
        iconTint={theme.colors.textLight}
        selectedIconTint={theme.colors.primaryDark}
        selectedButtonStyle={{
          backgroundColor: theme.colors.primaryDark,
        }}
      />
      <RichEditor
        ref={editorInstance}
        style={styles.rich}
        placeholder={placeholder}
        initialContentHTML={initialContent || ""}
        onChange={(html) => {
          if (onChange) {
            onChange(html || '');
          }
        }}
        androidHardwareAccelerationDisabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RNRichTextEditor;

const styles = StyleSheet.create({
  container: {
    minHeight: 285,
  },
  richBar: {
    height: 50,
    backgroundColor: theme.colors.gray,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  rich: {
    minHeight: 200,
    backgroundColor: 'white',
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.gray,
  },
});