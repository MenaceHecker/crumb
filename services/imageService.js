export const getUserImageSrc = imagePath => {
  if (!imagePath) { 
    return require('../assets/images/defaultUser2.png');
  }
  else { 
    return {uri: imagePath};
  }
}