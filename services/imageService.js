import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const getUserImageSrc = imagePath => {
  if (!imagePath) { 
    return require('../assets/images/defaultUser2.png');
  }
  else { 
    // If it's a full URL, return as is
    if (imagePath.startsWith('http')) {
      return { uri: imagePath };
    }
    // If it's a Supabase storage path, get the public URL
    const { data } = supabase.storage.from('uploads').getPublicUrl(imagePath);
    return { uri: data.publicUrl };
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
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(data.path);
    
    console.log('Public URL:', urlData.publicUrl);
    
    return { 
      success: true, 
      data: urlData.publicUrl // Return the full public URL instead of just the path
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