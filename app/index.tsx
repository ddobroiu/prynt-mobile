import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../lib/auth';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        // User is logged in, redirect to main app
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Se încarcă...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-primary mb-2">Prynt</Text>
        <Text className="text-xl text-gray-600 text-center">
          Tipărire profesională{'\n'}la îndemâna ta
        </Text>
      </View>

      <View className="w-full max-w-sm space-y-4">
        <TouchableOpacity
          className="bg-primary py-4 px-6 rounded-lg"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Autentificare
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border-2 border-primary py-4 px-6 rounded-lg"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-primary text-center font-semibold text-lg">
            Cont nou
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3"
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text className="text-gray-500 text-center">
            Continuă fără cont
          </Text>
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-10">
        <Text className="text-gray-400 text-sm">
          © 2025 Prynt.ro
        </Text>
      </View>
    </View>
  );
}
