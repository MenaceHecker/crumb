import moment from 'moment'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Avatar from './Avatar'

const CommentItem = ({item, canDelete = false}) => {
  const createdAt = moment(item?.created_at).format('MMM DD, YYYY');
  
  // Debug logging to see the comment structure
  console.log('CommentItem data:', item);
  console.log('CommentItem user:', item?.user);
  console.log('CommentItem users:', item?.users);
  
  // Handle different possible user data structures
  const userInfo = item?.user || item?.users || {};
  const userName = userInfo?.name || 'Unknown User';
  const userImage = userInfo?.image || null;
  
  // Additional debug
  console.log('Resolved userName:', userName);
  console.log('Resolved userImage:', userImage);
  
  return (
    <View style={styles.container}>
      <Avatar
        uri={userImage}
        />
        <View style={styles.content}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={styles.nameContainer}>
              <Text style={styles.text}>
                {userName}
              </Text>
              <Text>•</Text>
              <Text style={[styles.text, {color: theme.colors.textLight}]}>
                {createdAt}
              </Text>
            </View>
            {
              canDelete && (
                  <TouchableOpacity>
                    <Icon name="delete" size={20} color={theme.colors.rose} />
                  </TouchableOpacity>
              )
            }
          </View>
          <Text style={[styles.text, {fontWeight: 'normal'}]}>
            {item?.text}
          </Text>
        </View>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 7,
    },
    content: {
      backgroundColor: 'rgba(0,0,0,0.06)',
      flex: 1,
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: theme.radius.md, 
      borderCurve: 'continuous',
    },
    highlight: {
      borderWidth: 0.2,
      backgroundColor: 'white',
      borderColor: theme.colors.dark,
      shadowColor: theme.colors.dark,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    text: {
      fontSize: hp(1.6),
      fontWeight: theme.fonts.medium,
      color: theme.colors.textDark
    }
})