// import { Pressable, StyleSheet, Text, View } from 'react-native';
// import Delete from '../../assets/icons/Delete';
// import Edit from '../../assets/icons/Edit';
// import NFC from '../../assets/icons/NFCAdd';
// import Search from '../../assets/icons/Search';
// import Header from '../../components/Header';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import { theme } from '../../constants/theme';
// import { hp, wp } from '../../helpers/common';

// const NfcFriend = () => {
//     return (
//         <ScreenWrapper bg="white">
//             <Header 
//                 title="Add Friend via NFC" 
//                 showBackButton={true}
//                 mb={hp(3)}
//             />
            
//             <View style={styles.container}>
//                 {/* NFC Status */}
//                 <View style={styles.statusContainer}>
//                     <NFC width={hp(8)} height={hp(8)} fill={theme.colors.primary} />
//                     <Text style={styles.statusText}>NFC status placeholder</Text>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={styles.buttonContainer}>
//                     <Pressable style={[styles.button, styles.writeButton]}>
//                         <Edit width={hp(2.5)} height={hp(2.5)} fill="white" />
//                         <Text style={styles.buttonText}>Write My Info to NFC</Text>
//                     </Pressable>

//                     <Pressable style={[styles.button, styles.readButton]}>
//                         <Search width={hp(2.5)} height={hp(2.5)} fill="white" />
//                         <Text style={styles.buttonText}>Read Friend's NFC</Text>
//                     </Pressable>

//                     <Pressable style={[styles.button, styles.stopButton]}>
//                         <Delete width={hp(2.5)} height={hp(2.5)} fill="white" />
//                         <Text style={styles.buttonText}>Stop</Text>
//                     </Pressable>
//                 </View>

//                 {/* Instructions */}
//                 <View style={styles.instructionsContainer}>
//                     <Text style={styles.instructionsTitle}>How to use:</Text>
//                     <Text style={styles.instructionsText}>
//                         1. Tap "Write My Info to NFC" to save your profile to an NFC tag
//                     </Text>
//                     <Text style={styles.instructionsText}>
//                         2. Tap "Read Friend's NFC" and hold your phone near their NFC tag
//                     </Text>
//                     <Text style={styles.instructionsText}>
//                         3. Confirm to send a friend request
//                     </Text>
//                 </View>

//                 {/* Friends List Button */}
//                 <Pressable style={styles.friendsButton}>
//                     {/* <User width={hp(2.5)} height={hp(2.5)} fill={theme.colors.primary} strokeWidth={1.5} /> */}
//                     <Text style={styles.friendsButtonText}>View Friends</Text>
//                 </Pressable>
//             </View>
//         </ScreenWrapper>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: wp(4),
//     },
//     statusContainer: {
//         alignItems: 'center',
//         marginBottom: hp(4),
//         paddingVertical: hp(3),
//     },
//     statusText: {
//         fontSize: hp(2),
//         color: theme.colors.textLight,
//         textAlign: 'center',
//         marginTop: hp(2),
//     },
//     buttonContainer: {
//         gap: hp(2),
//         marginBottom: hp(4),
//     },
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: hp(2),
//         paddingHorizontal: wp(4),
//         borderRadius: theme.radius.md,
//         gap: wp(2),
//     },
//     writeButton: {
//         backgroundColor: theme.colors.primary,
//     },
//     readButton: {
//         backgroundColor: theme.colors.secondary,
//     },
//     stopButton: {
//         backgroundColor: theme.colors.rose,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: hp(2),
//         fontWeight: theme.fonts.medium,
//     },
//     instructionsContainer: {
//         backgroundColor: theme.colors.gray,
//         padding: wp(4),
//         borderRadius: theme.radius.md,
//         marginBottom: hp(3),
//     },
//     instructionsTitle: {
//         fontSize: hp(2.2),
//         fontWeight: theme.fonts.semibold,
//         color: theme.colors.text,
//         marginBottom: hp(1),
//     },
//     instructionsText: {
//         fontSize: hp(1.8),
//         color: theme.colors.textLight,
//         marginBottom: hp(0.5),
//     },
//     friendsButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: hp(2),
//         paddingHorizontal: wp(4),
//         borderRadius: theme.radius.md,
//         borderWidth: 1,
//         borderColor: theme.colors.primary,
//         gap: wp(2),
//     },
//     friendsButtonText: {
//         color: theme.colors.primary,
//         fontSize: hp(2),
//         fontWeight: theme.fonts.medium,
//     },
// });

// export default NfcFriend;

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Delete from '../../assets/icons/Delete';
import Edit from '../../assets/icons/Edit';
import NFC from '../../assets/icons/NFCAdd';
import Search from '../../assets/icons/Search';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { getUserById, sendFriendRequest } from '../../services/friendsService';
import NfcService from '../../services/nfcService';

const { width } = Dimensions.get('window');

const NfcFriend = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isWriting, setIsWriting] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [nfcStatus, setNfcStatus] = useState('Initializing NFC...');
    
    // Animation values
    const [pulseAnim] = useState(new Animated.Value(1));
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        initializeNFC();
        
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            cleanup();
        };
    }, []);

    // Pulse animation for NFC icon
    useEffect(() => {
        if (isWriting || isReading) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [isWriting, isReading]);

    const cleanup = async () => {
        try {
            if (NfcService && typeof NfcService.cleanup === 'function') {
                await NfcService.cleanup();
                console.log('NFC cleanup completed');
            } else {
                console.log('NFC cleanup not available');
            }
        } catch (error) {
            console.log('Cleanup error:', error);
        }
    };

    const initializeNFC = async () => {
        try {
            if (!NfcService) {
                console.error('NfcService is not available');
                setNfcStatus('NFC service not available');
                return;
            }

            console.log('Starting NFC initialization...');
            const result = await NfcService.initialize();
            console.log('NFC initialize result:', result);
            
            if (!result) {
                console.error('NFC initialize returned null/undefined');
                setNfcStatus('NFC not available on this device');
                return;
            }

            if (!result.success) {
                console.error('NFC initialization failed:', result.msg);
                Alert.alert('NFC Error', result.msg || 'Failed to initialize NFC');
                setNfcStatus('NFC initialization failed');
                return;
            }

            console.log('NFC initialized successfully, checking if enabled...');
            const enabledResult = await NfcService.checkNFCEnabled();
            console.log('NFC enabled check result:', enabledResult);
            
            if (!enabledResult) {
                console.error('NFC enabled check returned null/undefined');
                setNfcStatus('Cannot check NFC status');
                return;
            }

            if (!enabledResult.success) {
                console.error('NFC enabled check failed:', enabledResult.msg);
                Alert.alert('NFC Error', enabledResult.msg || 'Failed to check NFC status');
                setNfcStatus('NFC check failed');
                return;
            }

            if (!enabledResult.enabled) {
                console.log('NFC is disabled');
                Alert.alert('NFC Disabled','Please enable NFC in your device settings to use this feature.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Open Settings', 
                            onPress: () => NfcService.openNFCSettings()
                        }
                    ]
                );
                setNfcStatus('NFC is disabled');
                return;
            }

            console.log('NFC is ready');
            setNfcStatus('NFC is ready');
        } catch (error) {
            console.error('NFC initialization error:', error);
            if (error.message) {
                setNfcStatus(`NFC error: ${error.message}`);
            } else {
                setNfcStatus('NFC initialization failed');
            }
        }
    };

    const handleWriteNFC = async () => {
        if (!user?.id) {
            Alert.alert('Error', 'User not found');
            return;
        }

        setIsWriting(true);
        setNfcStatus('Hold your phone near an NFC tag to write your info...');

        try {
            const result = await NfcService.writeUserIdToNFC(user.id);
            
            if (result && result.success) {
                Alert.alert('Success', 'Your info has been written to the NFC tag!');
                setNfcStatus('NFC write successful');
            } else {
                const errorMsg = result?.msg || 'Failed to write to NFC tag';
                Alert.alert('Error', errorMsg);
                setNfcStatus('NFC write failed');
            }
        } catch (error) {
            console.error('NFC write error:', error);
            Alert.alert('Error', 'Failed to write to NFC tag');
            setNfcStatus('NFC write failed');
        } finally {
            setIsWriting(false);
        }
    };

    const handleReadNFC = async () => {
        if (!user?.id) {
            Alert.alert('Error', 'User not found');
            return;
        }

        setIsReading(true);
        setNfcStatus('Hold your phone near a friend\'s NFC tag to read...');

        try {
            const result = await NfcService.readUserIdFromNFC();
            
            if (result && result.success && result.userId) {
                const friendId = result.userId;
                
                if (friendId === user.id) {
                    Alert.alert('Error', 'You cannot add yourself as a friend');
                    setNfcStatus('Cannot add yourself');
                    return;
                }

                const friendResult = await getUserById(friendId);
                if (!friendResult || !friendResult.success) {
                    Alert.alert('Error', 'Friend not found');
                    setNfcStatus('Friend not found');
                    return;
                }

                const friend = friendResult.data;
                const friendName = friend?.name || friend?.email || 'Unknown User';

                Alert.alert(
                    'Add Friend',
                    `Do you want to send a friend request to ${friendName}?`,
                    [
                        { 
                            text: 'Cancel', 
                            style: 'cancel',
                            onPress: () => setNfcStatus('Friend request cancelled')
                        },
                        { 
                            text: 'Send Request', 
                            onPress: () => sendFriendRequestToUser(friendId, friendName)
                        }
                    ]
                );
            } else {
                const errorMsg = result?.msg || 'Failed to read from NFC tag';
                Alert.alert('Error', errorMsg);
                setNfcStatus('NFC read failed');
            }
        } catch (error) {
            console.error('NFC read error:', error);
            Alert.alert('Error', 'Failed to read from NFC tag');
            setNfcStatus('NFC read failed');
        } finally {
            setIsReading(false);
        }
    };

    const sendFriendRequestToUser = async (friendId, friendName) => {
        try {
            const result = await sendFriendRequest(user.id, friendId);
            
            if (result && result.success) {
                Alert.alert('Success', `Friend request sent to ${friendName}!`);
                setNfcStatus('Friend request sent');
            } else {
                const errorMsg = result?.msg || 'Failed to send friend request';
                Alert.alert('Error', errorMsg);
                setNfcStatus('Friend request failed');
            }
        } catch (error) {
            console.error('Friend request error:', error);
            Alert.alert('Error', 'Failed to send friend request');
            setNfcStatus('Friend request failed');
        }
    };

    const stopNFC = async () => {
        try {
            await NfcService.stopNFC();
            setIsWriting(false);
            setIsReading(false);
            setNfcStatus('NFC stopped');
        } catch (error) {
            console.error('Stop NFC error:', error);
            setNfcStatus('Failed to stop NFC');
        }
    };

    const getStatusColor = () => {
        if (nfcStatus.includes('ready')) return theme.colors.primary;
        if (nfcStatus.includes('successful') || nfcStatus.includes('sent')) return '#4CAF50';
        if (nfcStatus.includes('failed') || nfcStatus.includes('error')) return '#F44336';
        return theme.colors.textLight;
    };

    return (
        <ScreenWrapper bg="white">
            <Header 
                title="Add Friend via NFC" 
                showBackButton={true}
                mb={hp(2)}
            />
            
            <Animated.View 
                style={[
                    styles.container,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Animated.View 
                        style={[
                            styles.nfcIconContainer,
                            {
                                transform: [{ scale: pulseAnim }]
                            }
                        ]}
                    >
                        <View style={styles.nfcGradient}>
                            <NFC width={hp(6)} height={hp(6)} fill="white" />
                        </View>
                    </Animated.View>
                    
                    <Text style={styles.heroTitle}>Connect Instantly</Text>
                    <Text style={styles.heroSubtitle}>
                        Share your profile or discover friends with a simple tap
                    </Text>
                </View>

                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {nfcStatus}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionSection}>
                    <Pressable 
                        style={[styles.actionButton, isWriting && styles.buttonActive]}
                        onPress={handleWriteNFC}
                        disabled={isWriting || isReading}
                    >
                        <View
                            style={[
                                styles.buttonGradient,
                                isWriting 
                                    ? { backgroundColor: '#ff6b6b' } 
                                    : { backgroundColor: '#667eea' }
                            ]}
                        >
                            <View style={styles.buttonContent}>
                                {isWriting ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Edit width={hp(3)} height={hp(3)} fill="white" />
                                )}
                                <Text style={styles.buttonText}>
                                    {isWriting ? 'Writing to NFC...' : 'Share My Profile'}
                                </Text>
                                <Text style={styles.buttonSubtext}>
                                    Write your info to an NFC tag
                                </Text>
                            </View>
                        </View>
                    </Pressable>

                    <Pressable 
                        style={[styles.actionButton, isReading && styles.buttonActive]}
                        onPress={handleReadNFC}
                        disabled={isWriting || isReading}
                    >
                        <View
                            style={[
                                styles.buttonGradient,
                                isReading 
                                    ? { backgroundColor: '#ff6b6b' } 
                                    : { backgroundColor: '#f093fb' }
                            ]}
                        >
                            <View style={styles.buttonContent}>
                                {isReading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Search width={hp(3)} height={hp(3)} fill="white" />
                                )}
                                <Text style={styles.buttonText}>
                                    {isReading ? 'Reading NFC...' : 'Discover Friends'}
                                </Text>
                                <Text style={styles.buttonSubtext}>
                                    Read from a friend's NFC tag
                                </Text>
                            </View>
                        </View>
                    </Pressable>

                    {(isWriting || isReading) && (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }}
                        >
                            <Pressable 
                                style={styles.stopButton}
                                onPress={stopNFC}
                            >
                                <Delete width={hp(2.5)} height={hp(2.5)} fill="#F44336" />
                                <Text style={styles.stopButtonText}>Cancel</Text>
                            </Pressable>
                        </Animated.View>
                    )}
                </View>

                {/* Quick Guide */}
                <View style={styles.guideContainer}>
                    <Text style={styles.guideTitle}>Quick Guide</Text>
                    <View style={styles.guideSteps}>
                        <View style={styles.guideStep}>
                            <View style={[styles.stepNumber, { backgroundColor: '#667eea' }]}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <Text style={styles.stepText}>Tap "Share My Profile" to write your info to an NFC tag</Text>
                        </View>
                        <View style={styles.guideStep}>
                            <View style={[styles.stepNumber, { backgroundColor: '#f093fb' }]}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <Text style={styles.stepText}>Hold your phone near a friend's NFC tag to connect</Text>
                        </View>
                        <View style={styles.guideStep}>
                            <View style={[styles.stepNumber, { backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <Text style={styles.stepText}>Confirm to send a friend request instantly</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Button */}
                <Pressable 
                    style={styles.friendsButton}
                    onPress={() => router.push('/friends')}
                >
                    <Text style={styles.friendsButtonText}>View My Friends</Text>
                </Pressable>
            </Animated.View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: hp(3),
        marginBottom: hp(2),
    },
    nfcIconContainer: {
        marginBottom: hp(2),
    },
    nfcGradient: {
        width: hp(10),
        height: hp(10),
        borderRadius: hp(5),
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    heroTitle: {
        fontSize: hp(3),
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: hp(1),
    },
    heroSubtitle: {
        fontSize: hp(1.8),
        color: theme.colors.textLight,
        textAlign: 'center',
        lineHeight: hp(2.5),
        paddingHorizontal: wp(8),
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderRadius: 16,
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: wp(3),
    },
    statusText: {
        fontSize: hp(1.8),
        fontWeight: '500',
        flex: 1,
    },
    actionSection: {
        gap: hp(2),
        marginBottom: hp(4),
    },
    actionButton: {
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonActive: {
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    buttonGradient: {
        borderRadius: 20,
        paddingVertical: hp(2.5),
        paddingHorizontal: wp(4),
    },
    buttonContent: {
        alignItems: 'center',
        gap: hp(0.5),
    },
    buttonText: {
        color: 'white',
        fontSize: hp(2.2),
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonSubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: hp(1.6),
        textAlign: 'center',
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F44336',
        gap: wp(2),
    },
    stopButtonText: {
        color: '#F44336',
        fontSize: hp(1.8),
        fontWeight: '500',
    },
    guideContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: wp(4),
        marginBottom: hp(3),
    },
    guideTitle: {
        fontSize: hp(2.2),
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: hp(2),
    },
    guideSteps: {
        gap: hp(2),
    },
    guideStep: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: 'white',
        fontSize: hp(1.8),
        fontWeight: '600',
    },
    stepText: {
        flex: 1,
        fontSize: hp(1.8),
        color: theme.colors.textLight,
        lineHeight: hp(2.4),
    },
    friendsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: 'white',
        marginTop: 'auto',
        marginBottom: hp(2),
    },
    friendsButtonText: {
        color: theme.colors.primary,
        fontSize: hp(2),
        fontWeight: '600',
    },
});

export default NfcFriend;