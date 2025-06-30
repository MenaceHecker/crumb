import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import ButtonGen from '../../components/ButtonGen'
import Header from '../../components/Header'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { getSupabaseFileUrl } from '../../services/imageService'
import { createOrUpdatePost } from '../../services/postService'

const NewPost = () => {
  const {user, setAuth} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [bodyText, setBodyText] = useState(""); 

  const onPick = async (isImage) => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your media library');
        return;
      }

      let mediaConfig = {
        mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.7,
      }
      
      if(isImage) {
        mediaConfig.aspect = [4, 3];
      } else {
        // For videos, you might want to set additional options
        mediaConfig.videoMaxDuration = 60; // 60 seconds max
      }

      console.log('Launching image picker with config:', mediaConfig);
      let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
      console.log('ImagePicker result:', result);
      
      if(!result.canceled && result.assets && result.assets[0]){
        console.log('Selected file:', result.assets[0]);
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.log('ImagePicker error:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  }

  const getSupabaseFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }

  const isLocalFile = file => {
      if(!file) return null;
      if(typeof file == 'object') return true;
      return false;
  }

  const getFileType = file => {
    if(!file) return null;
    if(isLocalFile(file)) {
      // Check the mimeType or type property
      if(file.type) {
        return file.type.startsWith('image/') ? 'image' : 'video';
      }
      // Fallback to checking file extension
      if(file.uri) {
        const extension = file.uri.split('.').pop()?.toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        
        if(imageExtensions.includes(extension)) return 'image';
        if(videoExtensions.includes(extension)) return 'video';
      }
      return file.type || 'image'; // default fallback
    }
    // gonna check for remote files as well the ones that are on the cloud
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }

  const onSubmit = async () => {
    if(!bodyRef.current && !file){
      Alert.alert('Post', "Please choose an image or add post body");
      return;
    }
    
    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }

    // create a post under work 
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);    
    if(res.success) {
      Alert.alert('Success', 'Post created successfully!');
      setFile(null);
      bodyRef.current='';
      editorRef.current?.setContentHTML('');
      router.back();
    } else {
      // Error - show error message
      Alert.alert('Error', res?.msg || 'Failed to create post');
    }
  }

  console.log('NewPost component rendering...');
  console.log('User data:', user);

  useEffect(() => {
    console.log('NewPost component mounted');
    return () => {
      console.log('NewPost component unmounted');
    };
  }, []);

  const handleBodyChange = (body) => {
    console.log('Body changed:', body);
    bodyRef.current = body;
    setBodyText(body);
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{gap:20}}>
          {/* avatar comes here */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{gap:2}}>
              <Text style={styles.username}>
                {user && user.name}
              </Text>
              <Text style={styles.publicText}>
                Public
              </Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <Text style={{marginBottom: 10, fontSize: 16}}>Debug: Using TextInput instead of RichTextEditor</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.gray,
                borderRadius: theme.radius.md,
                padding: 15,
                minHeight: 150,
                textAlignVertical: 'top'
              }}
              placeholder="What's on your mind?"
              multiline
              value={bodyText}
              onChangeText={handleBodyChange}
            />
          </View>
          {
            file && (
              <View style = {styles.file}>
                {
                  getFileType(file) == 'video'? (
                    <Video
                    style = {{flex:1}}
                    source = {{
                      uri: getSupabaseFileUri(file)
                    }}
                    useNativeControls
                    resizeMode='cover'
                    isLooping
                    />
                  ): (
                    <Image source={{uri: getSupabaseFileUri(file)}} resizeMode='cover' style={{flex: 1}} />
                  )
                }
                <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                  <Icon name="delete" size={20} color="white" />
                </Pressable>
              </View>
            )
          }
         <View style={styles.media}>
          <Text style={styles.addImageText}>Add to your post</Text>
          <View style = {styles.mediaIcons}>
            <TouchableOpacity onPress={() => onPick(true)}>
              <Icon name="image" size={30} color={theme.colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPick(false)}>
              <Icon name="video" size={33} color={theme.colors.dark} />
            </TouchableOpacity>
          </View>
         </View>
        </ScrollView>
        <ButtonGen
        buttonStyle={{height: hp(6.2)}}
        title='Post'
        loading={loading}
        hasShadow={false}
        onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  textEditor: {
    // marginTop: 10,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  fileImage: {
    width: '100%',
    height: '100%',
  },
})