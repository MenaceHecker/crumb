import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../../assets/icons'
import Loading from '../../components/Loading'
import PostCard from '../../components/PostCard'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from "../../contexts/AuthContext"
import { hp, wp } from '../../helpers/common'
import { supabase } from '../../lib/supabase'
import { fetchPosts } from '../../services/postService'

var limit = 0;
const Home = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const handlePostEvent = async (payload) => {
        console.log('got post event: ', payload);
    }
    console.log('Home user: ', user);
    useEffect(() => {
        let postChannel = supabase
        .channel('posts')
        .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent) 
        .subscribe();

        getPosts();
        return () => {
            supabase.removeChannel(postChannel);
        }
    }, []);
    const getPosts = async ()=> {
        //calling the api
        limit = limit + 10;
        console.log('fetching posts: ', limit);
        let res = await fetchPosts(limit);
        if(res.success){
            setPosts(res.data);
        }
    }




    const onLogout = async () => {
        //setAuth(null);
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', error.message);
        }
    }
 

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header goes here now */}
        <View style={styles.header}>
            <Text style={styles.title}>Joe!?</Text>
            <View style = {styles.icons}>
                <Pressable onPress={() => router.push('/notifications')}>
                    <Icon name = "heart" size ={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                </Pressable>
                <Pressable onPress={() => router.push('/newPost')}>
                    <Icon name = "plus" size ={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                </Pressable>
                <Pressable onPress={() => router.push('/profile')}>
                    <Icon name = "user" size ={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                    {/* <Avatar
                    uri={user?.image}
                    size={hp(4.3)}
                    rounded={theme.radius.sm}
                    style={{borderWidth: 2}}
                    /> */}
                </Pressable>
            </View>
            </View>
            {/* post  */}
            <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item => item.id.toString())}
            renderItem={({item}) => <PostCard
                item={item}
                currentUser={user}
                router={router}
                />
        }
        ListFooterComponent={(
            <View style={{marginVertical: posts.length==0? 200:30}}>
                <Loading />
            </View>

        )}
        />
      </View>
      {/* <ButtonGen title='Logout' onPress={onLogout} /> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
    container : {
        flex : 1,
        // paddingHorizontal: wp(4)
    },
    header : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: wp(4),
    },
    title : {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    
},
    avatarImage : {
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
    pill:{
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
    })