import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NewSamplePost = () => {
  return (
     <View style={styles.container}>
      <Text style={styles.text}>New Post Screen - Test</Text>
    </View>
  )
}

export default NewSamplePost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'black',
  }
});

//Just storing it here
// import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import React, { useRef, useState } from 'react'
// import ScreenWrapper from '../../components/ScreenWrapper'
// import Header from '../../components/Header'
// import { theme } from '../../constants/theme'
// import { hp, wp } from '../../helpers/common'
// import Avatar from '../../components/Avatar'
// import { useAuth } from '../../contexts/AuthContext'
// import RichTextEditor from '../../components/RichTextEditor'
// import { useRoute } from '@react-navigation/native'
// import { useRouter } from 'expo-router'

// const NewPost = () => {
//   const {user} = useAuth();
//   const bodyRef = useRef("");
//   const editorRef = useRef(null);
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(file);
//   return (
//     <ScreenWrapper bg="white">
//       <View style ={styles.container}>
//         <Header title="Create Post" />
//         <ScrollView contentContainerStyle={{gap:20}}>
//           {/* avatar comes here */}
//           <View style={styles.header}>
//             <Avatar
//             uri={user?.image}
//             size={hp(6.5)}
//             rounded={theme.radius.xl}
//             />
//             <View style ={{gap:2}}>
//               <Text style={styles.username}>
//                 {
//                   user &&user.name
//                 }
//               </Text>
//               <Text style={styles.publicText}>
//                 Public
//               </Text>
//             </View>
//           </View>
//           <View style={styles.textEditor}>
//                 <RichTextEditor editorRef ={editorRef} onChange = {bodyRef.current = body}/>
//           </View>
//         </ScrollView>
//       </View>
//       <Header title="Create Post"/>
//     </ScreenWrapper>
//   )
// }

// export default NewPost

// const styles = StyleSheet.create({
//   closeIcon : {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   video : {

//   },
//   file: {
//     height: hp(30),
//     width: '100%',
//     borderRadius: theme.radius.xl,
//     overflow: 'hidden',
//     borderCurve: 'continuous'
//   },
//   imageIcon:{
//     borderRadius: theme.radius.md,
//   },
//   addImageText: {
//     fontSize: hp(1.9),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text,
//   },
//   mediaIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//   },
//   media: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     padding: 12, 
//     paddingHorizontal: 18,
//     borderRadius: theme.radius.xl,
//     borderCurve: 'continuous',
//     borderColor: theme.colors.gray
//   },
//   textEditor: {
//     //marginTop : 10,
//   },
//   avatar: {
//     height: hp(6.5),
//     width: wp(6.5),
//     borderRadius: theme.radius.xl,
//     borderCurve: 'continuous',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.1'
//   },
//   publicText: {
//     fontSize: hp(1.7),
//     fontWeight: theme.fonts.medium,
//     color: theme.colors.textLight,
//   },
//   username : {
//     fontSize: hp(2.2),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap : 12,
//   },
//   title: {
//     //marginBottom : 10,
//     fontSize: hp(2.5),
//     fontWeight: theme.fonts.semibold,
//     color: theme.colors.text,
//     textAlign: 'center',
//   },
//   container: {
//     flex: 1,
//     //backgriundColor: 'red',
//     marginBottom: 30,
//     paddingHorizontal: wp(4),
//     gap : 15
//   }
// })