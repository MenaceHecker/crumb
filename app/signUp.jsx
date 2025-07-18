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

const SignUp = () => { 
    const router = useRouter();
    const emailRef = React.useRef("");
    const passwordRef = React.useRef("");
    const nameRef = React.useRef("");
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async() => {
        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        if (!name || !email || !password) { 
            Alert.alert(
                "Error",
                "Please fill in all fields to sign up"
            );
            return; 
        }

        setLoading(true); 

        try { //Using this just because there is a chance the auth could fail
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name, 
                    },
                },
            });

            if (error) {
                console.error('Supabase Sign Up Error:', error.message); 
                Alert.alert('Sign Up Error', error.message);
            } else {
                if (data && data.user) { 
                    console.log('Sign Up successful! User:', data.user);

                    Alert.alert('Sign Up Success, what do you want now?');
                    router.replace('/login'); // could do router.replace('/home') for auto-login
                } else {
                    Alert.alert('Sign Up Success', 'Please check your email for a verification, or maybe not!');
                    router.replace('/login'); 
                }
            }
        } catch (error) {
            console.error('Unexpected Sign Up Error:', error); 
            Alert.alert('Sign Up Error', 'An unexpected error occurred during sign up.');
        } finally {
            setLoading(false); // setting loading to false when the process finishes
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
                            Let's Go
                        </Text>
                        <Text style={styles.welcomeText}>
                            FBI Open Up!
                        </Text>
                    </View>
                        {/* form goes here */}
                        <View style={styles.form}>
                            <Text style = {{fontSize: hp(1.5), color: theme.colors.text}}>
                                Please enter details to create an account
                            </Text>
                            <Input
                                icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                                placeholder="Full Name Please"
                                onChangeText={value => nameRef.current = value}
                            />
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
                                {/* Login Button */}
                                <ButtonGen title='Sign Up' loading={loading} onPress={onSubmit}/>
                            </View>

                        {    /* footer goes here */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?
                            </Text>
                            <Pressable onPress={() => router.push('/login')}>
                                <Text style={[styles.footerText, {
                                    color: theme.colors.primaryDark,
                                    fontWeight: theme.fonts.semibold
                                }]}>
                                    Log in
                                </Text>
                            </Pressable>
                        </View>
                </View>    
        </ScreenWrapper>
    )
} 

export default SignUp

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
        //color: theme.colors.text
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