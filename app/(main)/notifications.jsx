import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
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
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {
            notifications.map(item=>{
              return (
                <NotificationItem
                  item={item}
                  key={item?.id}
                  router={router}
                  />
              )
            })
          }
        </ScrollView>
      </View>
      </ScreenWrapper>
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