import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const {post,setPost} = useState(null);
    useEffect(() => {
        getPostDetails();
    }, []);
    const postDetails = async () => {
        //fetch post details from server here
    }
  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({})