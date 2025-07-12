import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(()=> {
      getNotifications();
  },[]);
  return (
    <View>
      <Text>Notification</Text>
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({})