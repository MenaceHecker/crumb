import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

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
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/*user info and post time goes here */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
            />
            <View style = {{gap: 2}}>
              <Text style={styles.username}>{item?.user?.name}</Text>
              <Text style={styles.postTime}>{item?.created_at}</Text>
            </View>
        </View>
      </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    aklignItems: 'center',
    gap: 15,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl*1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    gap: 10,
    //marginBottom: 10,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postMedia: {
    height: hp(40),
    wdth: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
})