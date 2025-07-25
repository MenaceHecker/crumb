import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../../assets/icons'
import NFC from '../../assets/icons/NFCAdd'
import Loading from '../../components/Loading'
import PostCard from '../../components/PostCard'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from "../../contexts/AuthContext"
import { hp, wp } from '../../helpers/common'
import { supabase } from '../../lib/supabase'
import { fetchPosts } from '../../services/postService'

var limit = 0;

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

const Home = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);

    const handlePostEvent = async (payload) => {
        console.log('Post event received:', payload);
        
        if(payload.eventType === 'INSERT' && payload?.new?.id) {
            let newPost = {...payload.new};
            let res = await getUserData(newPost.userId);
            newPost.user = res.success ? res.data : {};
            newPost.postLikes = [];
            newPost.comments = [{count: 0}];
            
            // Add the new post to the beginning of the array
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
        
        // Handle UPDATE events
        if(payload.eventType === 'UPDATE' && payload?.new?.id) {
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === payload.new.id ? {...post, ...payload.new} : post
                )
            );
        }
        
        // Handle DELETE events
        if(payload.eventType === 'DELETE' && payload?.old?.id) {
            setPosts(prevPosts => {
                let updatedPosts = prevPosts.filter(post => post.id !== payload.old.id);
                return updatedPosts;
            })
        }
    };

    const handleLikeEvent = async (payload) => {
        console.log('Like event received:', payload);
        
        if(payload.eventType === 'INSERT' && payload?.new) {
            const { postId, userId } = payload.new;
            
            // Get user data for the like
            const userRes = await getUserData(userId);
            const likeWithUser = {
                ...payload.new,
                user: userRes.success ? userRes.data : {}
            };
            
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    if(post.id === postId) {
                        return {
                            ...post,
                            postLikes: [...(post.postLikes || []), likeWithUser]
                        };
                    }
                    return post;
                })
            );
        }
        
        if(payload.eventType === 'DELETE' && payload?.old) {
            const { postId, userId } = payload.old;
            
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    if(post.id === postId) {
                        return {
                            ...post,
                            postLikes: (post.postLikes || []).filter(like => like.userId !== userId)
                        };
                    }
                    return post;
                })
            );
        }
    };

    const handleCommentEvent = async (payload) => {
        console.log('Comment event received:', payload);
        
        if(payload.eventType === 'INSERT' && payload?.new) {
            const { postId, userId } = payload.new;
            
            // Get user data for the comment
            const userRes = await getUserData(userId);
            const commentWithUser = {
                ...payload.new,
                user: userRes.success ? userRes.data : {}
            };
            
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    if(post.id === postId) {
                        // Update comment count
                        const currentCount = post.comments && post.comments.length > 0 
                            ? post.comments[0].count || 0 
                            : 0;
                        
                        return {
                            ...post,
                            comments: [{ count: currentCount + 1 }]
                        };
                    }
                    return post;
                })
            );
        }
        
        if(payload.eventType === 'DELETE' && payload?.old) {
            const { postId } = payload.old;
            
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    if(post.id === postId) {
                        // Update comment count
                        const currentCount = post.comments && post.comments.length > 0 
                            ? post.comments[0].count || 0 
                            : 0;
                        
                        return {
                            ...post,
                            comments: [{ count: Math.max(0, currentCount - 1) }]
                        };
                    }
                    return post;
                })
            );
        }
    };

    const handleNewNotification = async (payload) => {
        if(payload.eventType === 'INSERT' && payload.new.id) {
            setNotificationCount(prev => prev + 1);
        }
    };

    console.log('Home user: ', user);
    
    useEffect(() => {
        // Initialize posts
        getPosts();
        
        // Set up real-time subscriptions
        const postChannel = supabase
            .channel('posts')
            .on('postgres_changes', {
                event: '*', 
                schema: 'public', 
                table: 'posts'
            }, handlePostEvent)
            .subscribe();

        const likeChannel = supabase
            .channel('postLikes')
            .on('postgres_changes', {
                event: '*', 
                schema: 'public', 
                table: 'postLikes'
            }, handleLikeEvent)
            .subscribe();

        const commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: '*', 
                schema: 'public', 
                table: 'comments'
            }, handleCommentEvent)
            .subscribe();

        const notificationChannel = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `receiverId=eq.${user.id}`
            }, handleNewNotification)
            .subscribe();
        
        return () => {
            supabase.removeChannel(postChannel);
            supabase.removeChannel(likeChannel);
            supabase.removeChannel(commentChannel);
            supabase.removeChannel(notificationChannel);
        }
    }, [user.id]);

    const getPosts = async () => {
        try {
            setLoading(true);
            if(!hasMore) return null;
            limit = limit + 10;
            let res = await fetchPosts(limit);
            if(res.success) {
                if(posts.length == res.data.length) setHasMore(false);
                setPosts(res.data);
            }
        } catch (error) {
            console.log('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', error.message);
        }
    };

    // Function to clear notification count when user visits notifications
    const handleNotificationPress = () => {
        setNotificationCount(0);
        router.push('/notifications');
    };

    // Function to handle NFC friend adding
    const handleNFCPress = () => {
       router.push('/nfcFriend');
       
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* header goes here now */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome</Text>
                    <View style={styles.icons}>
                        <Pressable onPress={handleNotificationPress}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                            {
                                notificationCount > 0 && (
                                    <View style={styles.pill}>
                                        <Text style={styles.pillText}>{notificationCount}</Text>
                                    </View>
                                )
                            }
                        </Pressable>
                        <Pressable onPress={handleNFCPress}>
                            <NFC size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/newPost')}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/profile')}>
                            <Icon name="user" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                    </View>
                </View>
                
                {/* posts */}
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <PostCard
                            item={item}
                            currentUser={user}
                            router={router}
                        />
                    )}
                    onEndReached={() => {
                        getPosts();
                    }}
                    onEndReachedThreshold={0}
                    ListFooterComponent={hasMore? (
                        <View style={{marginVertical: posts.length === 0 ? 200 : 30}}>
                            {loading && <Loading />}
                        </View>
                    ) : (
                            <View style={{marginVertical: 30}}>
                                <Text style={styles.noPosts}> No more posts</Text>
                                </View>
                    )}

                />
            </View>
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text
    },
    pill: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight
    },
    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }
});