import { Video } from 'expo-av'
import { Image } from 'expo-image'
import moment from 'moment'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/icons'
import Avatar from '../components/Avatar'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import { getSupabaseFileUrl } from '../services/imageService'

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
    shadowOpacity: 0.06,  
    shadowRadius: 6,
    elevation: 1
    }
    const createdAt = moment(item?.created_at).format('MMM DD, YYYY');
    const openPostDetails = () => { //not implement now 
    };
    
    // Debug logs to check data structure
    console.log('PostCard item:', item);
    console.log('PostCard user:', item?.user);
    console.log('PostCard username:', item?.user?.name);
    
    // Helper function to get proper URI
    const getMediaUri = (file) => {
      const result = getSupabaseFileUrl(file);
      return result?.uri || result; // Handle both object and string returns
    };
    
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
              <Text style={styles.username}>
                {item?.user?.name || item?.users?.name || 'Unknown User'}
              </Text>
              <Text style={styles.postTime}>{createdAt}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Add post content if it exists */}
      {item?.body && (
        <View style={styles.content}>
          <Text style={styles.postBody}>{item.body}</Text>
        </View>
      )}
      
      {/* Media content - moved outside of body check */}
      {item?.file && item?.file?.includes('postImages') && (
        <Image
          source={getSupabaseFileUrl(item?.file)}
          transition={100}
          style={styles.postMedia}
          contentFit='cover'
        />
      )}
      
      {/* Video content */}
      {item?.file && item?.file?.includes('postVideos') && (
        <Video
          style={[styles.postMedia, {height: hp(30)}]}
          source={{ uri: getMediaUri(item?.file) }}
          useNativeControls
          resizeMode='cover'
          isLooping
          shouldPlay={false}
          onError={(error) => console.log('Video error:', error)}
        />
      )}
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
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
})