import { Video } from 'expo-av'
import { Image } from 'expo-image'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../assets/icons'
import Avatar from '../components/Avatar'
import { theme } from '../constants/theme'
import { hp, stripHtmlTags } from '../helpers/common'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { createPostLike, removePostLike } from '../services/postService'
import Loading from './Loading'

const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
    showMoreIcon = true,
}) => {
  // Early return if item is null/undefined
  if (!item) {
    return (
      <View style={[styles.container, hasShadow && shadowStyles]}>
        <Text style={styles.errorText}>Post data not available</Text>
      </View>
    );
  }

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
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Safe access to likes and currentUser
  const liked = likes.filter(like => like.userId == currentUser?.id)[0] ? true : false;
  
  useEffect(() => {
    // Safe initialization of likes
    setLikes(item?.postLikes || []);
  }, [item?.postLikes])

  const openPostDetails = () => { 
    if(!showMoreIcon) return null;
    router.push({pathname: 'postDetails' , params: {postId: item?.id}});
  };
  
  // Debug logs to check data structure
  console.log('PostCard item:', item);
  console.log('PostCard user:', item?.user || item?.users);
  console.log('PostCard username:', item?.user?.name || item?.users?.name);
  
  // Helper function to get proper URI
  const getMediaUri = (file) => {
    if (!file) return null;
    const result = getSupabaseFileUrl(file);
    return result?.uri || result; // Handle both object and string returns
  };

  const onShare = async () => {
    let content = {message: stripHtmlTags(item?.body || '')};
    if(item?.file){
      setLoading(true);
      try {
        let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
        setLoading(false);
        content.url = url;
      } catch (error) {
        console.log('Download error:', error);
        setLoading(false);
        Alert.alert('Error', 'Could not download media for sharing');
        return;
      }
    }
    Share.share(content);
  }

  const onLike = async () => {
    if (!currentUser?.id) {
      Alert.alert('Error', 'Please log in to like posts');
      return;
    }

    if(liked){
      //remove like
      let updatedLikes = likes.filter(like => like.userId != currentUser?.id);
      setLikes([...updatedLikes])
      let res = await removePostLike(item?.id, currentUser?.id);
      if(!res.success){
        Alert.alert('Post', 'Something went wrong!' );
      }
    }
    else{
      //to create like
      let data = {
        userId: currentUser?.id,
        postId: item?.id
      }
      setLikes([...likes, data])
      let res = await createPostLike(data);
      if(!res.success){
        Alert.alert('Post', 'Something went wrong!' );
      }
    }
  }

  // Safe access to user data with fallback
  const userInfo = item?.user || item?.users || {};
  const username = userInfo?.name || 'Unknown User';
  const userImage = userInfo?.image || null;
  
  // Safe access to comment count
  const commentCount = item?.comments?.[0]?.count || 0;
  
  console.log('post item: ', item);
  
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/*user info and post time goes here */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={userImage}
            rounded={theme.radius.md}
          />
          <View style={{gap: 2}}>
            <Text style={styles.username}>
              {username}
            </Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {
          showMoreIcon && (
            <TouchableOpacity onPress={openPostDetails}>
              <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
            </TouchableOpacity>
          )
        }
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

      {/* like,comment, share goes here */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon name="heart" size={24} fill={liked? theme.colors.rose : 'transparent'} color={liked? theme.colors.rose : theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>
            {likes?.length || 0}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>
            {commentCount}
          </Text>
        </View>
        <View style={styles.footerButton}>
          {
            loading? (
              <Loading size="small" />
            ):(
              <TouchableOpacity onPress={onShare}>
                <Icon name="share" size={24} color={theme.colors.textLight} />
              </TouchableOpacity>
            )
          }
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
  errorText: {
    color: theme.colors.textLight,
    fontSize: hp(1.6),
    textAlign: 'center',
    padding: 10,
  },
})