import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const CrumbSplashScreen = ({ onAnimationFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();

    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // Fade in and scale the main container
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Animate the dots
      Animated.timing(dotsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Animate the text
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(800),
    ]);

    animationSequence.start(() => {
      // Hide the splash screen
      SplashScreen.hideAsync();
      // Call the callback if provided
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    });
  }, []);

  const CrumbIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.iconBackground}>
        <Animated.View 
          style={[
            styles.dotsContainer,
            {
              opacity: dotsAnim,
              transform: [
                {
                  translateY: dotsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
        
        <Animated.Text
          style={[
            styles.brandText,
            {
              opacity: textAnim,
              transform: [
                {
                  translateY: textAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          crumb
        </Animated.Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <CrumbIcon />
        </Animated.View>
        
        {/* Subtle background elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f6f0',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  iconBackground: {
    width: 140,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 32,
    borderWidth: 6,
    borderColor: '#B8860B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B8860B',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B8860B',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(184, 134, 11, 0.05)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: height * 0.2,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    left: width * 0.1,
  },
});

export default CrumbSplashScreen;