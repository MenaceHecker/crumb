import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { router, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import BackButton from '../../components/BackButton'
import { wp } from '../../helpers/common'
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

const styles = StyleSheet.create({})