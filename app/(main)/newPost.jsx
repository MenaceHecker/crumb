import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import ButtonGen from '../../components/ButtonGen'
import Header from '../../components/Header'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { getSupabaseFileUrl } from '../../services/imageService'

const NewPost = () => {
  const {user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [bodyText, setBodyText] = useState(""); 

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
    }
    if(!isImage){
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({mediaConfig});
    console.log('file:', result.assets[0]); 
    if(!result.canceled){
      setFile(result.assets[0]);
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
    if(isLocalFile(file))
    {
      return file.type;
    }
    // gonna check for remote files as well the ones that are on the cloud
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }
  const onSubmit = async () => {

  }

  // Add console logs to track rendering
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
                    <></>
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
          {/* <View style={styles.textEditor}>
            <RichTextEditor 
              editorRef={editorRef} 
              onChange={handleBodyChange}
            />
          </View> */}
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