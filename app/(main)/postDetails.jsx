import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '../../assets/icons';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { fetchPostDetails } from '../../services/postService';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const [post, setPost] = useState(null); // Fixed: use array destructuring, not object
    const {user}  = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = useRef('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        getPostDetails(); // Call the function here
    }, []);
    
    const getPostDetails = async () => {
        //fetch post details from server here
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.data);
        setStartLoading(false);
    }
    const onNewComment = async () => {

    }
    
    if(startLoading){
        return (
            <View style ={styles.center}>
                <Loading/>
            </View>
        )
    }
    
  return (
    <View style={styles.container}>
      <ScrollView showVerticalScrollIndicator={false} style={styles.list}>
        <PostCard
            item={post}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon = {false}
            />
            {/*commenting the input */}
            <View style={styles.inputContainer}>
                <Input
                    inputRef={inputRef}
                    placeholder="Type your comment here..."
                    onChangeText={value => commentRef.current = value}
                    placeholderTextColor={theme.colors.textLight}
                    containerStyle={{flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
                    />
                    {
                        loading? (
                                <View style={styles.loading}>
                                    <Loading size="small" />
                                    </View>
                        ):(
                            <TouchableOpacity style={styles.sendIcon}>
                        <Icon name="send" color={theme.colors.primaryDark} />
                    </TouchableOpacity>

                        )
                    }
                    
            </View>
        </ScrollView>
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
        width: wp(5.8),
    },
    center: {
        flex: 1,
        alignContent:'center',
        justifyContent: 'center',
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text, // Fixed typo: was "clor"
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: wp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: 1.3}],
    }
})