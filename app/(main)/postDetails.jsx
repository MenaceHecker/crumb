import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { supabase } from '../../lib/supabase';
import { createNotification } from '../../services/notificationService';
import { createComment, fetchPostDetails, removeCommment, removePost } from '../../services/postService';

const getUserData = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.log('Error fetching user data:', error);
            return { success: false, msg: error.message };
        }
        
        return { success: true, data };
    } catch (error) {
        console.log('Error fetching user data:', error);
        return { success: false, msg: error.message };
    }
};

const PostDetails = () => {
    const {postId, commentId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const {user}  = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = useRef('');
    const [loading, setLoading] = useState(false);
    
    const handlenewComment = async (payload) => {
        if(payload.new){
            let newComment = {...payload.new};
            let res = await getUserData(newComment.userId);
            newComment.users = res.success ? res.data : {};
            setPost( prevPost => {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost.comments]
                }
            })
        }
    }

    const handleCommentDelete = async (payload) => {
        if(payload.eventType === 'DELETE' && payload.old) {
            console.log('Real-time comment delete:', payload.old);
            setPost(prevPost => {
                if (!prevPost?.comments) return prevPost;
                
                return {
                    ...prevPost,
                    comments: prevPost.comments.filter(c => c.id !== payload.old.id)
                };
            });
        }
    }

    useEffect(() => {
        let commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: 'INSERT', 
                schema: 'public', 
                table: 'comments',
                filter: `postId=eq.${postId}`
            }, handlenewComment)
            .on('postgres_changes', {
                event: 'DELETE', 
                schema: 'public', 
                table: 'comments',
                filter: `postId=eq.${postId}`
            }, handleCommentDelete)
            .subscribe();

        getPostDetails();
        
        return () => {
            supabase.removeChannel(commentChannel);
        }
    }, []);
    
    const getPostDetails = async () => {
        //fetch post details from server here
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.data);
        setStartLoading(false);
    }
    
    const onNewComment = async () => {
        if(!commentRef.current) return null;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current,
        }
        //create comment
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if(res.success){
            if(user.id != post.userId)
            {
                //send notification if user is not the current user
                let notify ={
                    senderId: user.id,
                    receiverId: post.userId,
                    title:"commented on your post",
                    data: JSON.stringify({postId: post.id, commentId: res?.data?.id})
                }
                createNotification(notify);
            }
            inputRef.current.clear();
            commentRef.current = "";
            
            // Note: The real-time subscription will handle adding the comment to the UI
            // so we don't need to manually update the state here
        }else{
            Alert.alert('Comment', res.msg);
        }
    }
    
    const onDeleteComment = async (comment) => {
        console.log('=== DELETE COMMENT DEBUG ===');
        console.log('1. Comment to delete:', JSON.stringify(comment, null, 2));
        console.log('2. Comment ID:', comment?.id, 'Type:', typeof comment?.id);
        console.log('3. Current user ID:', user?.id);
        console.log('4. Comment user ID:', comment?.userId);
        console.log('5. Post owner ID:', post?.userId);
        
        // Double-check permissions before API call
        const canDelete = user.id === comment.userId || user.id === post.userId;
        console.log('6. Can delete check:', canDelete);
        
        if (!canDelete) {
            Alert.alert('Error', 'You can only delete your own comments or comments on your posts');
            return;
        }
        
        console.log('7. About to call removeCommment with ID:', comment?.id);
        let res = await removeCommment(comment?.id);
        console.log('8. API Response:', JSON.stringify(res, null, 2));
        
        if(res.success){
            console.log('9. API Delete successful');
            // Note: The real-time subscription will handle removing the comment from the UI
            // so we don't need to manually update the state here
        } else {
            console.log('10. API Delete failed:', res.msg);
            Alert.alert('Comment', res.msg);
        }
        
        console.log('=== END DELETE COMMENT DEBUG ===');
    }

    const onDeletePost = async (item) => {
        let res = await removePost(post.id);
        if(res.success){
            router.back();
        }
        else{
            Alert.alert('Post', res.msg);
        }
    }
    
    const onEditPost = async (item) => {
        router.replace({pathname: 'newPost', params: {...item}})
    }
    
    if(startLoading){
        return (
            <View style ={styles.center}>
                <Loading/>
            </View>
        )
    }
    if (!post){
        return (
            <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
                <Text style={styles.notFound}>Post not found</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showVerticalScrollIndicator={false} style={styles.list}>
                <PostCard
                    item={{...post, comments: [{count: post?.comments?.length}]}}
                    currentUser={user}
                    router={router}
                    hasShadow={false}
                    showMoreIcon = {false}
                    showDelete= {true}
                    onDelete={onDeletePost}
                    onEdit={onEditPost}
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
                            <Icon name="send" color={theme.colors.primaryDark} onPress={onNewComment} />
                        </TouchableOpacity>

                            )
                        }
                        
                </View>
                
                {/* comments here */}
                <View style = {{marginVertical: 15, gap: 17}}>
                {
                    post?.comments?.map(comment => {
                        // Fixed: Check proper user ID structure and permissions
                        const commentUserId = comment.userId || comment.users?.id;
                        const canDelete = user.id === commentUserId || user.id === post.userId;
                        
                        console.log('Comment render - User ID:', user.id, 'Comment User ID:', commentUserId, 'Post Owner ID:', post.userId, 'Can Delete:', canDelete);
                        
                        return (
                            <CommentItem
                                key= {comment?.id?.toString()}
                                item={comment}
                                onDelete={onDeleteComment}
                                highlight={comment.id == commentId}
                                canDelete={canDelete}
                                />
                        );
                    })
                }
                {
                    post?.comments?.length === 0 && (
                        <Text style ={{color: theme.colors.text, marginLeft: 5}}>
                            Be first to comment on this post!
                        </Text>
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
        color: theme.colors.text,
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