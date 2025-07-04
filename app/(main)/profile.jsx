import { StyleSheet, Text, TouchableOpacity, View, Alert, Pressable } from 'react-native' 
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useRouter } from 'expo-router' // 
import { useAuth } from '../../contexts/AuthContext' 
import Header from '../../components/Header'
import BackButton from '../../components/BackButton'
import { wp, hp } from '../../helpers/common'
import Icon from '../../assets/icons' 
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'
import { router } from 'expo-router'

const Profile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth(); 

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

  return (
    <ScreenWrapper bg='white'>
      <UserHeader user = {user} router = {router} handleLogout={handleLogout}/>
    </ScreenWrapper>
  )
}


const UserHeader = ({user, router, handleLogout}) => {
  return (
    <View style = {{flex:1, backgroundColor: 'white', paddingHorizontal: wp(4)}}>
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      <View style={{gap: 15}}>
        <View style={styles.avatarContainer}>
          <Avatar
        uri={user?.image}
        size={hp(12)}
        rounded={theme.radius.xxl*1.4}
        />
        <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
          <Icon name="edit" strokeWidth={2.5} size={20} />
        </Pressable>
        </View>
        {/* username and address*/}
        <View style={{alignItems: 'center', gap: 4}}>
          <Text style={styles.userName}> 
            {user?.name || user?.user_metadata?.full_name || 'No Name'} 
          </Text>
          <Text style={styles.infoText}> 
            {user?.address || 'No Address'} 
          </Text>
        </View>
        {/* Here goes the email, phone , bio */}
        <View style={{gap:10}}>
          <View style={styles.info}>
            <Icon name="mail" size={20} color={theme.colors.textLight} />
            <Text style={styles.infoText}>
              {user && user.email}
            </Text>
          </View>
          {
            user && user.phoneNumber && (
                        <View style={styles.info}>
            <Icon name="call" size={20} color={theme.colors.textLight} />
            <Text style={styles.infoText}>
              {user && user.phoneNumber}
            </Text>
          </View>
            )
          }

          {
            user && user.bio && (
              <Text style={styles.infoText}>
                {user.bio}
              </Text>
            )
          }
        </View>
      </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2',
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  avatarContainer: {
    height: hp(12),
    // width: wp(12),
    alignSelf: 'center',
     alignItems: 'center'
  },
  headerShape: {
    width: wp(100),
    height: hp(20)
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  container: {
    flex: 1,
  }
  });