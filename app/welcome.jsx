import { useRouter } from 'expo-router';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import ButtonGen from '../components/ButtonGen';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';

const Welcome = () => {
  const router = useRouter();
  
  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" /> 
      <View style={styles.container}>
        {/* welcome image goes here */}
        <Image 
          style={styles.welcomeImage} 
          resizeMode='contain' 
          source={require('../assets/images/welcome4.png')} 
        />
        
        {/* title of the app - Test with explicit string */}
        <View style={{gap: 20}}>
          <Text style={styles.title}>Hey</Text>
          <Text style={styles.punchline}>
            What are es be happening in the world today?
          </Text>
        </View>

        {/* the footer goes here */}
        <View style={styles.footer}>
          <ButtonGen
            title="Get Started"
            buttonStyle={{marginHorizontal: wp(3)}}
            onPress={() => router.push('/signUp')}
          />
          
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={[styles.loginText, {
                color: theme.colors.primaryDark, 
                fontWeight: theme.fonts.semibold
              }]}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
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
    punchline: {
      textAlign: 'center',
      paddingHorizontal: wp(10),
      fontSize: hp(1.7),
      color: theme.colors.text,
    },
    footer: {
      gap: 30,
      width: '100%',
    },
    bottomTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
    },
    loginText: {
      textAlign: 'center',
      color: theme.colors.text, //theme.colors.text
      fontSize: hp(1.8),
    }
})