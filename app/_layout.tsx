import { Colors } from '@/constants/theme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export default function RootLayout() {

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.navBar },
          headerTintColor: Colors.textMain,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="exam" options={{ headerBackVisible: false }} />
        <Stack.Screen name="result" options={{ title: 'Results', headerBackVisible: false }} />
        <Stack.Screen name="review" options={{ title: 'Review Incorrect Questions', }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
