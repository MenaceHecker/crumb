import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import NotificationItem from '../../components/NotificationItem';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { fetchNotifications } from '../../services/notificationService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const { user } = useAuth(); // Get current user
  
  useEffect(() => {
    if (user?.id) {
      getNotifications();
    }
  }, [user?.id]);

  const getNotifications = async () => {
    try {
      let res = await fetchNotifications(user.id); // Use user.id instead of UserActivation.id
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {
            notifications.map(item => {
              return (
                <NotificationItem
                  item={item}
                  key={item?.id}
                  router={router}
                />
              )
            })
          }
          {
            notifications.length === 0 && (
              <Text style={styles.noData}>No Notifications to display!</Text>
            )
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