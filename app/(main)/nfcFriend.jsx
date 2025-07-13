import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../assets/icons';
import NFC from '../assets/icons/NFCAdd';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { hp, wp } from '../helpers/common';
import { getUserById, sendFriendRequest } from '../services/friendsService';
import NfcService from '../services/nfcService';

const NfcFriend = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isWriting, setIsWriting] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [nfcStatus, setNfcStatus] = useState('');

    useEffect(() => {
        initializeNFC();
        return () => {
            NfcService.cleanup();
        };
    }, []);

    const initializeNFC = async () => {
        const result = await NfcService.initialize();
        if (!result.success) {
            Alert.alert('NFC Error', result.msg);
            return;
        }

        const enabledResult = await NfcService.checkNFCEnabled();
        if (!enabledResult.success) {
            Alert.alert('NFC Error', enabledResult.msg);
            return;
        }

        if (!enabledResult.enabled) {
            Alert.alert(
                'NFC Disabled', 
                'Please enable NFC in your device settings to use this feature.',
                [
                    { text: 'OK', style: 'default' }
                ]
            );
            return;
        }

        setNfcStatus('NFC is ready');
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
            
            if (result.success) {
                Alert.alert('Success', 'Your info has been written to the NFC tag!');
                setNfcStatus('NFC write successful');
            } else {
                Alert.alert('Error', result.msg);
                setNfcStatus('NFC write failed');
            }
        } catch (error) {
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
            
            if (result.success) {
                const { userId: friendId } = result;
                
                // Check if trying to add themselves
                if (friendId === user.id) {
                    Alert.alert('Error', 'You cannot add yourself as a friend');
                    setNfcStatus('Cannot add yourself');
                    return;
                }

                // Get friend's info
                const friendResult = await getUserById(friendId);
                if (!friendResult.success) {
                    Alert.alert('Error', 'Friend not found');
                    setNfcStatus('Friend not found');
                    return;
                }

                const friend = friendResult.data;

                // Show confirmation dialog
                Alert.alert(
                    'Add Friend',
                    `Do you want to send a friend request to ${friend.name || friend.email}?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Send Request', 
                            onPress: () => sendFriendRequestToUser(friendId, friend.name || friend.email)
                        }
                    ]
                );
            } else {
                Alert.alert('Error', result.msg);
                setNfcStatus('NFC read failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to read from NFC tag');
            setNfcStatus('NFC read failed');
        } finally {
            setIsReading(false);
        }
    };

    const sendFriendRequestToUser = async (friendId, friendName) => {
        try {
            const result = await sendFriendRequest(user.id, friendId);
            
            if (result.success) {
                Alert.alert('Success', `Friend request sent to ${friendName}!`);
                setNfcStatus('Friend request sent');
            } else {
                Alert.alert('Error', result.msg);
                setNfcStatus('Friend request failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send friend request');
            setNfcStatus('Friend request failed');
        }
    };

    const stopNFC = async () => {
        await NfcService.stopNFC();
        setIsWriting(false);
        setIsReading(false);
        setNfcStatus('NFC stopped');
    };

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Icon name="arrowLeft" size={hp(2.5)} color={theme.colors.text} />
                    </Pressable>
                    <Text style={styles.title}>Add Friend via NFC</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* NFC Status */}
                <View style={styles.statusContainer}>
                    <NFC size={hp(8)} color={theme.colors.primary} />
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
                            <Icon name="edit" size={hp(2.5)} color="white" />
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
                            <Icon name="search" size={hp(2.5)} color="white" />
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
                            <Icon name="x" size={hp(2.5)} color="white" />
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
                    <Icon name="users" size={hp(2.5)} color={theme.colors.primary} />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
        marginTop: hp(2),
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    placeholder: {
        width: hp(2.5),
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