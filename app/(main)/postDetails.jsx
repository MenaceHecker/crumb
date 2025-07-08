import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { fetchPostDetails } from '../../services/postService';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const {post,setPost} = useState(null);
    useEffect(() => {
        getPostDetails();
    }, []);
    const postDetails = async () => {
        //fetch post details from server here
        let res = await fetchPostDetails(postId);
        if(res.success) {
            setPost(res.data);
        }
    }
  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sendIcon: {
        alignItems: 'center',
        justifyContent:'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    center: {
        flex: 1,
        alignContent:'center',
        justifyContent: 'center',
    },
    notFound: {
        fontSize: hp(2.5),
        clor: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: 1.3}],
    }
})