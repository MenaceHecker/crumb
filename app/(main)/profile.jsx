import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import BackButton from '../../components/BackButton'
import { wp, hp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'


const Profile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const handleLogout = async () => {

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
        <Header title="Profile" showBackButton = {true}/>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
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
    width: wp(12),
    alignSelf: 'center'
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
    flex: 1
  }
})