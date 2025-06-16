import { StyleSheet, Text, View, Button, StatusBar, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'
import { wp } from '../helpers/common';
import { hp } from '../helpers/common';
import {theme} from '../constants/theme';
import ButtonGen from '../components/ButtonGen';

const Welcome = () => {
  console.log('Calculated Image Width:', wp(100)); // Tesing this for error 
  console.log('Calculated Image Height:', hp(30));
  return (
    <ScreenWrapper bg="white">
      <StatusBar style ="dark" />
      <View style = {styles.container}>
        {/* welcome image goes here */}
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome3.png')} />
      {/* title of the app */}
      <View style = {{gap :20}}>
        <Text style = {styles.title}>Joe!</Text>
        <Text style = {styles.punchline}>
          What are es be happening in the world today?
        </Text>
      </View>
      {/*the footer goes here */}
      <View style = {styles.footer}>
      <ButtonGen
      title='Get Started'
      buttonStyle={{marginHorizontal: wp(3)}}
      onPress={() => {}}
      />
      </View>
      {/* the footer ends here */}
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        width: wp(115),
        height: hp(50),
        alignSelf: 'center',
    },
    title: {
      color: theme.colors.text,
      fontSize: hp(4),
      textAlign: 'center',
      fontWeight: theme.fonts.extraBold
    },
    punchline:{
      textAlign: 'center',
      paddingHorizontal: wp(10),
      fontSize: hp(1.7),
      color: theme.colors.text,
    },
    footer : {
      gap: 30,
      width: '100%',
    }
})