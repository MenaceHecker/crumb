import { supabase } from '../lib/supabase';

export const getUserImageSrc = imagePath => {
  if (!imagePath) { 
    return require('../assets/images/defaultUser2.png');
  }
  else { 
    return {uri: imagePath};
  }
}
export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
      let fileName = getFilePath (folderName, isImage);
      let filebBase64 = getFilePath(folderName, isImage);
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding : FileSystem.EncodingType.Base64
      });
      let imageData = decode(fileBase64); //This gives an array buffer
      let {data, error} = await supabase
      .storage
      .from('uploads')
      .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage? 'image/*' : 'video'
      });
      if(error) 
      {
        console.log('File Upload Error!', error);
        return {success: false, msg: 'Could not upload the media'};
      }
      console.log('data', data);
      return {success: true, data: data.path}
      }

  catch(error){
    console.log('File upload error', error);
    return {success: false, msg: 'Could not upload the media'};
  }
}
export const getFilePath = (folderName, isImage) =>
  {
    // return /${folderName}/${new Date()).getTime()}${isImage?}
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png' : '.mp4'}`;
  }