import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../constants/theme'

const NotificationItem = ({
    item,
    router
}) => {
  return (
    <View>
      <Text>NotificationItem</Text>
    </View>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous'
    }
})