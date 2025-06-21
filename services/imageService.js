export const getUserImageSrc = imagePath => {
  if (!imagePath) { 
    return require('../assets/images/defaultUser.png');
  }
  else { 
    return {uri: imagePath};
  }
}