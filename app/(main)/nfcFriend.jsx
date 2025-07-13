import { Pressable, StyleSheet, Text, View } from 'react-native';
import Delete from '../../assets/icons/Delete';
import Edit from '../../assets/icons/Edit';
import NFC from '../../assets/icons/NFCAdd';
import Search from '../../assets/icons/Search';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const NfcFriend = () => {
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
                    <Text style={styles.statusText}>NFC status placeholder</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button, styles.writeButton]}>
                        <Edit width={hp(2.5)} height={hp(2.5)} fill="white" />
                        <Text style={styles.buttonText}>Write My Info to NFC</Text>
                    </Pressable>

                    <Pressable style={[styles.button, styles.readButton]}>
                        <Search width={hp(2.5)} height={hp(2.5)} fill="white" />
                        <Text style={styles.buttonText}>Read Friend's NFC</Text>
                    </Pressable>

                    <Pressable style={[styles.button, styles.stopButton]}>
                        <Delete width={hp(2.5)} height={hp(2.5)} fill="white" />
                        <Text style={styles.buttonText}>Stop</Text>
                    </Pressable>
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
                <Pressable style={styles.friendsButton}>
                    {/* <User width={hp(2.5)} height={hp(2.5)} fill={theme.colors.primary} strokeWidth={1.5} /> */}
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