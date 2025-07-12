import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(()=> {
      getNotifications();
  },[]);
  const getNotifications = async () =>
  {
    let res = await fetchNotifications(UserActivation.id);
    if(res.success){
      setNotifications(res.data);
    }
  }
  return (
    <View>
      <Text>Notification</Text>
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center'
  }
})