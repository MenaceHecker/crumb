// app/(main)/_layout.jsx
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
