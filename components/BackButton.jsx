import { Pressable, StyleSheet } from 'react-native';
import ArrowLeft from '../assets/icons/ArrowLeft';
import { theme } from '../constants/theme';

const BackButton = ({size = 26, router}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <ArrowLeft size={size} strokeWidth = {2.5} color={theme.colors.text} /> 
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