import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabaseUrl } from '../constants';
import { supabase } from '../lib/supabase';

export const getUserImageSrc = imagePath => {
  if (imagePath) { 
    return getSupabaseFileUrl(imagePath);
  }
  else{
    return require('../assets/images/defaultUser2.png');
  }
}
export const getSupabaseFileUrl = filePath => {
  if(filePath) {
    if (filePath.startsWith('http')) {
      return {uri: filePath};
    }
    return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
  }
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    console.log('Starting upload for:', fileUri);
    
    // Generate unique filename
    const fileName = getFilePath(folderName, isImage);
    console.log('Generated filename:', fileName);
    
    // Read file as base64
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    console.log('File read as base64, length:', fileBase64.length);
    
    // Convert base64 to array buffer
    const imageData = decode(fileBase64);
    console.log('Converted to array buffer, size:', imageData.byteLength);
    
    // Upload to Supabase
    const { data, error } = await supabase
      .storage
      .from('uploads')
      .upload(fileName, imageData, {
        cacheControl: '3600',
        upsert: false,
        contentType: isImage ? 'image/png' : 'video/mp4'
      });
    
    if (error) {
      console.log('File Upload Error!', error);
      return { success: false, msg: 'Could not upload the media' };
    }
    
    console.log('Upload successful, data:', data);
    
    return { 
      success: true, 
      data: data.path
    };
    
  } catch (error) {
    console.log('File upload error', error);
    return { success: false, msg: 'Could not upload the media' };
  }
}

export const getFilePath = (folderName, isImage) => {
  const timestamp = new Date().getTime();
  const extension = isImage ? '.png' : '.mp4';
  return `${folderName}/${timestamp}${extension}`;
}

export const downloadFile = async (url) => {
    try{
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
    } catch(error) {
      return null;
    }
}
export const getLocalFilePath = filePath => {
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}