import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { Image } from 'expo-image'
import { useAuth } from '../../contexts/AuthContext'
import { getUserImageSrc } from '../../services/imageService'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import ButtonGen from '../../components/ButtonGen'

const EditProfile = () => {
    const {user : currentUser} = useAuth(); 
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: null,
        bio: '',
        address: ''
    });
    useEffect(() => {
        if(currentUser){
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: currentUser.image || '',
                address: currentUser.address || '',
                bio: currentUser.bio || '',
            })
        }
    }, [currentUser]
    )
    const onPickImage = async () => {

    }
    const onSubmit = async () => {
        let userData = {...user};
        let {name, phoneNumber, address, image, bio} = userData;
        if(!name || !phoneNumber || !address || !image || !bio)
        {
            Alert.alert("Profile", "Joe fill up all fields");
            return; 
        }
        setLoading(true);
        // update user goes here
    }
    let imageSource = getUserImageSrc(user.image);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style ={{flex:1}}>
            <Header title = "Edit Profile" />
            {/* Here goes a form to edit */}
            <View style={styles.form}>
                <View style={styles.avatarContainer}>
                    <Image source={imageSource} style={styles.avatar} />
                    <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                        <Icon name="camera" size = {20} strokeWidth={2.5}/>
                    </Pressable>
                </View>
                <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                    Wut are your profile about
                </Text>
                <Input
                icon ={<Icon name={"user"}/>}
                placeholder="Your name please?"
                value = {user.name}
                onChangeText = {value => setUser({...user, name:value })}
                />
                <Input
                icon ={<Icon name={"call"}/>}
                placeholder="You got a phone?"
                value = {user.phoneNumber}
                onChangeText = {value => setUser({...user, phoneNumber:value })}
                />
                <Input
                icon ={<Icon name={"location"}/>}
                placeholder="Got home or are you thy homeless?"
                value = {user.address}
                onChangeText = {value => setUser({...user, address:value })}
                />
                <Input
                placeholder="Bio what do you know about yourself?"
                value = {user.bio}
                containerStyle = {styles.bio}
                multiline={true}
                onChangeText = {value => setUser({...user, bio:value })}
                />

                <ButtonGen title="Update" loading={loading} onPress={onSubmit}/>
            </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    bio: {
        flexDirection: 'row',
        height: hp(1.5),
        alignItems: 'flex-start',
        paddingVertical: 15,
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15,
    },
    form: {
        gap: 18,
        marginTop: 20
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl*1.8,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: 'center',
    }
})