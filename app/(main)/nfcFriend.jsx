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
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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

const NfcFriend = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isWriting, setIsWriting] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [nfcStatus, setNfcStatus] = useState('Initializing NFC...');

    useEffect(() => {
        initializeNFC();
        return () => {
            // Clean up NFC operations
            cleanup();
        };
    }, []);

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
            // Check if NfcService exists
            if (!NfcService) {
                console.error('NfcService is not available');
                setNfcStatus('NFC service not available');
                return;
            }

            console.log('Starting NFC initialization...');
            const result = await NfcService.initialize();
            console.log('NFC initialize result:', result);
            
            // Handle null or undefined result
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
            
            // Handle null or undefined result
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
                Alert.alert(
                    'NFC Disabled', 
                    'Please enable NFC in your device settings to use this feature.',
                    [
                        { text: 'OK', style: 'default' }
                    ]
                );
                setNfcStatus('NFC is disabled');
                return;
            }

            console.log('NFC is ready');
            setNfcStatus('NFC is ready');
        } catch (error) {
            console.error('NFC initialization error:', error);
            console.error('Error type:', typeof error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            
            // More specific error handling
            if (error.message) {
                setNfcStatus(`NFC error: ${error.message}`);
            } else {
                setNfcStatus('NFC initialization failed');
            }
            
            // Don't show alert for common initialization failures
            // Alert.alert('Error', 'Failed to initialize NFC');
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
                
                // Check if trying to add themselves
                if (friendId === user.id) {
                    Alert.alert('Error', 'You cannot add yourself as a friend');
                    setNfcStatus('Cannot add yourself');
                    return;
                }

                // Get friend's info
                const friendResult = await getUserById(friendId);
                if (!friendResult || !friendResult.success) {
                    Alert.alert('Error', 'Friend not found');
                    setNfcStatus('Friend not found');
                    return;
                }

                const friend = friendResult.data;
                const friendName = friend?.name || friend?.email || 'Unknown User';

                // Show confirmation dialog
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

    return (
        <ScreenWrapper bg="white">
            <Header 
                title="Add Friend via NFC" 
                showBackButton={true}
                mb={hp(3)}
            />
            
            <View style={styles.container}>
                {/* NFC Status */}
                <View style={styles.statusContainer}>
                    <NFC width={hp(8)} height={hp(8)} fill={theme.colors.primary} />
                    <Text style={styles.statusText}>{nfcStatus}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={[styles.button, styles.writeButton, isWriting && styles.buttonDisabled]}
                        onPress={handleWriteNFC}
                        disabled={isWriting || isReading}
                    >
                        {isWriting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Edit width={hp(2.5)} height={hp(2.5)} fill="white" />
                        )}
                        <Text style={styles.buttonText}>
                            {isWriting ? 'Writing...' : 'Write My Info to NFC'}
                        </Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button, styles.readButton, isReading && styles.buttonDisabled]}
                        onPress={handleReadNFC}
                        disabled={isWriting || isReading}
                    >
                        {isReading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Search width={hp(2.5)} height={hp(2.5)} fill="white" />
                        )}
                        <Text style={styles.buttonText}>
                            {isReading ? 'Reading...' : 'Read Friend\'s NFC'}
                        </Text>
                    </Pressable>

                    {(isWriting || isReading) && (
                        <Pressable 
                            style={[styles.button, styles.stopButton]}
                            onPress={stopNFC}
                        >
                            <Delete width={hp(2.5)} height={hp(2.5)} fill="white" />
                            <Text style={styles.buttonText}>Stop</Text>
                        </Pressable>
                    )}
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>How to use:</Text>
                    <Text style={styles.instructionsText}>
                        1. Tap "Write My Info to NFC" to save your profile to an NFC tag
                    </Text>
                    <Text style={styles.instructionsText}>
                        2. Tap "Read Friend's NFC" and hold your phone near their NFC tag
                    </Text>
                    <Text style={styles.instructionsText}>
                        3. Confirm to send a friend request
                    </Text>
                </View>

                {/* Friends List Button */}
                <Pressable 
                    style={styles.friendsButton}
                    onPress={() => router.push('/friends')}
                >
                    <Text style={styles.friendsButtonText}>View Friends</Text>
                </Pressable>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: hp(4),
        paddingVertical: hp(3),
    },
    statusText: {
        fontSize: hp(2),
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: hp(2),
    },
    buttonContainer: {
        gap: hp(2),
        marginBottom: hp(4),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.md,
        gap: wp(2),
    },
    writeButton: {
        backgroundColor: theme.colors.primary,
    },
    readButton: {
        backgroundColor: theme.colors.secondary,
    },
    stopButton: {
        backgroundColor: theme.colors.rose,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: theme.fonts.medium,
    },
    instructionsContainer: {
        backgroundColor: theme.colors.gray,
        padding: wp(4),
        borderRadius: theme.radius.md,
        marginBottom: hp(3),
    },
    instructionsTitle: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        marginBottom: hp(1),
    },
    instructionsText: {
        fontSize: hp(1.8),
        color: theme.colors.textLight,
        marginBottom: hp(0.5),
    },
    friendsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        gap: wp(2),
    },
    friendsButtonText: {
        color: theme.colors.primary,
        fontSize: hp(2),
        fontWeight: theme.fonts.medium,
    },
});

export default NfcFriend;