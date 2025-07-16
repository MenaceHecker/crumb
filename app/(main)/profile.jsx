import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { supabase } from '../../lib/supabase';
import { fetchPosts } from '../../services/postService';

var limit = 0;
const Profile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const onLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
        console.error('Supabase Sign Out Error:', error.message); 
        Alert.alert('Sign Out Error', error.message);
    } else {
        setAuth(null);
        console.log('User signed out successfully.');
    }
  }

  const handleLogout = async () => { 
    Alert.alert('Confirm', 'Are you sure you wanna logout?', [
      {
        text: 'Cancel',
        onPress: ()=> console.log('Logout cancelled'),
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: () => onLogout(), 
        style: 'destructive'
      }
    ])
  }

  const getPosts = async () => {
          try {
              setLoading(true);
              if(!hasMore) return null;
              limit = limit + 10;
              let res = await fetchPosts(limit, user.id);
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

  return (
    <ScreenWrapper bg='white'>
      <FlatList
        data={posts}
        ListHeaderComponent={<UserHeader user = {user} router = {router} handleLogout={handleLogout} posts={posts}/>}
        ListHeaderComponentStyle={{marginBottom: 20}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
        ListFooterComponent={hasMore ? (
          <View style={{ marginVertical: posts.length === 0 ? 100 : 30 }}>
            {loading && <Loading />}
          </View>
        ) : (
          <View style={{ marginVertical: 30 }}>
            <Text style={styles.noPosts}> No more posts</Text>
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const UserHeader = ({user, router, handleLogout, posts}) => {

  return (
    <View style={styles.headerContainer}>
      {/* Top Header with username and menu */}
      <View style={styles.topHeader}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>
            {user?.name || user?.user_metadata?.full_name || 'No Name'}
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.textDark} size={24} />
        </TouchableOpacity>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar and Stats Row */}
        <View style={styles.avatarStatsRow}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(10)}
              rounded={theme.radius.xxl*1.4}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.friendsCount || 0}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.displayName}>
            {user?.name || user?.user_metadata?.full_name || 'No Name'}
          </Text>
          {user?.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
          {user?.address && (
            <Text style={styles.bio}>{user.address}</Text>
          )}
          {user?.email && (
            <Text style={styles.bio}>{user.email}</Text>
          )}
          {user?.phoneNumber && (
            <Text style={styles.bio}>{user.phoneNumber}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('editProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addFriendButton}>
            <Text style={styles.addFriendText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  listStyle: {
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  menuButton: {
    padding: 8,
  },
  profileSection: {
    paddingVertical: hp(2),
  },
  avatarStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  avatarContainer: {
    marginRight: wp(8),
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  statLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    marginTop: 2,
  },
  bioSection: {
    marginBottom: hp(2),
  },
  displayName: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  bio: {
    fontSize: hp(1.6),
    color: theme.colors.textDark,
    lineHeight: hp(2.2),
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: hp(2),
  },
  editButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  shareButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  addFriendButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFriendText: {
    fontSize: hp(2),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  postsGridHeader: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.gray,
    paddingTop: hp(1.5),
  },
  gridTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  gridTabText: {
    fontSize: hp(2.5),
    color: theme.colors.textDark,
  },
});