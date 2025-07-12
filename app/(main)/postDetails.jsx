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
import { createComment, fetchPostDetails, removeCommment, removePost } from '../../services/postService';


const PostDetails = () => {
    const {postId} = useLocalSearchParams();
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

    useEffect(() => {
            let commentChannel = supabase
                .channel('comments')
                .on('postgres_changes', {
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'comments',
                    filter: 'postId=eq.${postId}'
                }, handlenewComment)
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
            //to send notification later
            inputRef.current.clear();
            commentRef.current = "";
            
            // Create the comment object with user data included
            const newCommentWithUser = {
                ...res.data,
                users: {
                    id: user.id,
                    name: user.name,
                    image: user.image
                }
            };
            
            // Update the post with the new comment
            setPost(prevPost => {
                if (!prevPost) return prevPost;
                
                return {
                    ...prevPost,
                    comments: [...(prevPost.comments || []), newCommentWithUser]
                };
            });
        }else{
            Alert.alert('Comment', res.msg);
        }
    }
    
    const onDeleteComment = async (comment) => {
        console.log('=== DELETE COMMENT DEBUG ===');
        console.log('1. Comment to delete:', JSON.stringify(comment, null, 2));
        console.log('2. Comment ID:', comment?.id, 'Type:', typeof comment?.id);
        console.log('3. Current post comments before delete:', post?.comments?.length);
        console.log('4. All comment IDs:', post?.comments?.map(c => c.id));
        
        console.log('About to call removeCommment with ID:', comment?.id);
        let res = await removeCommment(comment?.id);
        console.log('5. API Response:', JSON.stringify(res, null, 2));
        console.log('6. API Response success:', res?.success);
        
        if(res.success){
            console.log('6. API Delete successful - updating UI');
            
            // Method 1: Try the re-fetch approach
            console.log('7. Re-fetching post details...');
            await getPostDetails();
            console.log('8. After re-fetch, comments count:', post?.comments?.length);
            
            // If re-fetch doesn't work, let's also try manual state update
            setTimeout(() => {
                console.log('9. Attempting manual state update as backup...');
                setPost(prevPost => {
                    if (!prevPost?.comments) {
                        console.log('10. No comments found in prevPost');
                        return prevPost;
                    }
                    
                    console.log('11. Before manual filter:', prevPost.comments.length, 'comments');
                    const filteredComments = prevPost.comments.filter(c => {
                        const shouldKeep = String(c.id) !== String(comment.id);
                        console.log(`12. Comment ${c.id} (${typeof c.id}): ${shouldKeep ? 'KEEP' : 'REMOVE'}`);
                        return shouldKeep;
                    });
                    
                    console.log('13. After manual filter:', filteredComments.length, 'comments');
                    
                    const updatedPost = {
                        ...prevPost,
                        comments: filteredComments
                    };
                    
                    console.log('14. Returning updated post with', updatedPost.comments.length, 'comments');
                    return updatedPost;
                });
            }, 100);
            
        } else {
            console.log('6. API Delete failed:', res.msg);
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
                post?.comments?.map(comment => 
                    <CommentItem
                     key= {comment?.id?.toString()}
                     item={comment}
                     onDelete={onDeleteComment}
                     canDelete= {user.id == comment.userId || user.id == post.userId}
                     />
                )
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