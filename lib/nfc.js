import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

// Will call this once when the app starts so maybe in App.js or a specific screen
export async function initNFC() {
  await NfcManager.start();
}

// Write=ing the user ID or username/token to NFC
export async function writeUserIdToNFC(userId) {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const message = [Ndef.textRecord(userId)];
    const bytes = Ndef.encodeMessage(message);
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
  } catch (err) {
    console.warn('NFC Write Error:', err);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

// This function would try to read 
export async function readUserIdFromNFC() {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    const payload = tag?.ndefMessage?.[0]?.payload;
    const userId = payload ? Ndef.text.decodePayload(payload) : null;
    return userId;
  } catch (err) {
    console.warn('NFC Read Error:', err);
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
