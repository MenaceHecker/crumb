import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

class NFCService {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return { success: true };
        
        try {
            const isSupported = await NfcManager.isSupported();
            if (!isSupported) {
                return { success: false, msg: 'NFC is not supported on this device' };
            }

            await NfcManager.start();
            this.isInitialized = true;
            return { success: true };
        } catch (error) {
            console.log('NFC initialization error:', error);
            return { success: false, msg: 'Failed to initialize NFC' };
        }
    }

    async checkNFCEnabled() {
        try {
            const isEnabled = await NfcManager.isEnabled();
            return { success: true, enabled: isEnabled };
        } catch (error) {
            console.log('NFC check error:', error);
            return { success: false, msg: 'Failed to check NFC status' };
        }
    }

    async writeUserIdToNFC(userId) {
        try {
            // Initialize if not already done
            const initResult = await this.initialize();
            if (!initResult.success) return initResult;

            // Check if NFC is enabled
            const enabledResult = await this.checkNFCEnabled();
            if (!enabledResult.success) return enabledResult;
            if (!enabledResult.enabled) {
                return { success: false, msg: 'Please enable NFC in your device settings' };
            }

            // Request NFC tech
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Create NDEF message with user ID
            const bytes = Ndef.encodeMessage([
                Ndef.textRecord(`crumb_user:${userId}`)
            ]);

            // Write to NFC tag
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
            
            return { success: true, msg: 'Successfully wrote to NFC tag' };
        } catch (error) {
            console.log('NFC write error:', error);
            return { success: false, msg: 'Failed to write to NFC tag' };
        } finally {
            // Clean up
            try {
                await NfcManager.cancelTechnologyRequest();
            } catch (error) {
                console.log('NFC cleanup error:', error);
            }
        }
    }

    async readUserIdFromNFC() {
        try {
            // Initialize if not already done
            const initResult = await this.initialize();
            if (!initResult.success) return initResult;

            // Check if NFC is enabled
            const enabledResult = await this.checkNFCEnabled();
            if (!enabledResult.success) return enabledResult;
            if (!enabledResult.enabled) {
                return { success: false, msg: 'Please enable NFC in your device settings' };
            }

            // Request NFC tech
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Read NDEF message
            const tag = await NfcManager.ndefHandler.getNdefMessage();
            
            if (tag && tag.length > 0) {
                // Parse the NDEF message
                const ndefRecord = tag[0];
                const payload = ndefRecord.payload;
                
                // Convert payload to string
                let text = '';
                for (let i = 3; i < payload.length; i++) {
                    text += String.fromCharCode(payload[i]);
                }
                
                // Check if it's a Crumb user ID
                if (text.startsWith('crumb_user:')) {
                    const userId = text.replace('crumb_user:', '');
                    return { success: true, userId };
                } else {
                    return { success: false, msg: 'This is not a Crumb user NFC tag' };
                }
            } else {
                return { success: false, msg: 'No data found on NFC tag' };
            }
        } catch (error) {
            console.log('NFC read error:', error);
            return { success: false, msg: 'Failed to read from NFC tag' };
        } finally {
            // Clean up
            try {
                await NfcManager.cancelTechnologyRequest();
            } catch (error) {
                console.log('NFC cleanup error:', error);
            }
        }
    }

    async stopNFC() {
        try {
            await NfcManager.cancelTechnologyRequest();
            return { success: true };
        } catch (error) {
            console.log('NFC stop error:', error);
            return { success: false, msg: 'Failed to stop NFC' };
        }
    }

    async cleanup() {
        try {
            if (this.isInitialized) {
                await NfcManager.stop();
                this.isInitialized = false;
            }
            return { success: true };
        } catch (error) {
            console.log('NFC cleanup error:', error);
            return { success: false, msg: 'Failed to cleanup NFC' };
        }
    }
}

export default new NFCService();