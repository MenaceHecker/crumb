import { StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const NotificationItem = ({
    item,
    router
}) => {
    const handleClick = () => {
        // open post details
    }
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
        <Text> NotificationItem </Text>
    </TouchableOpacity>
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
    },
    nameTitle: {
        flex: 1,
        gap: 2
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text
    }
})