import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Home from '../assets/icons/Home';
import { theme } from '../constants/theme'
import Icon from '../assets/icons';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {wp, hp} from '../helpers/common';
import Input from '../components/Input';

const Login = () => {
    const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
        <View style = {styles.container}>
            <BackButton router = {router} />
            {/* welcome text goes here */}
            <View>
                <Text style={styles.welcomeText}>
                    Welcome Back!
                </Text>
                {/* form goes here */}
                <View style={styles.form}>
                    <Text style = {{fontSize: hp(1.5), color: theme.colors.text}}>
                        Please login to your account
                    </Text>
                    <Input
                        icon={<Icon name="email" size={26} strokeWidth = {1.6} />}
                        placeholder="Email"
                        onChangeText={value => {}}
                        />
                    </View>
            </View>
            </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        gap: 45,
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    }
})