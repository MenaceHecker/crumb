import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
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
import { Button } from '@react-navigation/elements';
import ButtonGen from '../components/ButtonGen';
import { supabase } from '../lib/supabase';
import { getUserData } from '../services/userService'; // Assuming this is imported for profile data fetch
import { useAuth } from '../contexts/AuthContext'; // Assuming this is imported for setAuth

const Login = () => {
    const router = useRouter();
    const { setUserData } = useAuth(); // setUserData is available if needed, but _layout should handle setAuth
    const emailRef = React.useRef("");
    const passwordRef = React.useRef("");
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async() => {
        // 1. Basic Validation and early exit
        if(!emailRef.current || !passwordRef.current) {
            Alert.alert(
                "Error",
                "Please fill in all fields"
            );
            return; // <--- IMPORTANT: Stop execution if validation fails
        }
        
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        
        setLoading(true); // Start loading

        try {
            const {data: authData, error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if(error) {
                console.error('Login Error:', error); // Use console.error for actual errors
                Alert.alert('Login Error', error.message);
                return; // <--- IMPORTANT: Stop execution if login fails
            }

            // SUCCESS PATH:
            // At this point, login was successful.
            // The `_layout.jsx`'s `onAuthStateChange` listener will now be triggered.
            // It is responsible for:
            // 1. Fetching the complete user profile data from your database (if needed).
            // 2. Calling setAuth() in your AuthContext with the full user object.
            // 3. Navigating the user to the correct screen (e.g., '/home').
            // Therefore, NO explicit navigation (router.push/replace/dismissAll)
            // or setUserData calls are needed here in Login.jsx.

            console.log('Login successful! Auth state change will handle navigation and user data.');

        } catch (error) {
            console.error('Unexpected Login error:', error); // Catch any unexpected JS errors
            Alert.alert('Login Error', 'An unexpected error occurred during login.');
        } finally {
            setLoading(false); // <--- Always stop loading, whether success or error (handled by try/catch)
        }
    };

    return (
        <ScreenWrapper bg = "white">
            <StatusBar style="dark" />
                <View style = {styles.container}>
                    <BackButton router = {router} />
                    {/* welcome text goes here */}
                    <View>
                        <Text style={styles.welcomeText}>
                            Joe
                        </Text>
                        <Text style={styles.welcomeText}>
                            Welcome Back!
                        </Text>
                    </View>
                        {/* form goes here */}
                        <View style={styles.form}>
                            <Text style = {{fontSize: hp(1.5), color: theme.colors.text}}>
                                Please login to your account
                            </Text>
                            <Input
                                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                                placeholder="Email"
                                onChangeText={value => emailRef.current = value}
                            />
                            <Input
                                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                                placeholder="Password"
                                secureTextEntry={true}
                                onChangeText={value => passwordRef.current = value}
                            />
                            <Text style = {styles.forgotPassword }>
                                Forgot Password?
                                </Text>
                                {/* Login Button */}
                                <ButtonGen title='Login' loading={loading} onPress={onSubmit}/>
                            </View>

                        {    /* footer goes here */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Don't have an account?
                            </Text>
                            <Pressable onPress={() => router.push('/signUp')}>
                                <Text style={[styles.footerText, {
                                    color: theme.colors.primaryDark,
                                    fontWeight: theme.fonts.semibold
                                }]}>
                                    Sign Up
                                </Text>
                            </Pressable>
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
        color : 'red',
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