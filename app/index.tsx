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
    <View className="flex-1 bg-blue-50">
      {/* Header Section */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo Circle */}
        <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-6 shadow-lg">
          <Text className="text-white text-4xl font-bold">P</Text>
        </View>

        {/* Brand */}
        <Text className="text-5xl font-bold text-gray-900 mb-3">Prynt</Text>
        <Text className="text-lg text-gray-600 text-center mb-2">
          Tipărire profesională
        </Text>
        <Text className="text-base text-gray-500 text-center mb-12">
          Comenzi rapide • Livrare în toată țara
        </Text>

        {/* Action Buttons */}
        <View className="w-full max-w-sm space-y-4">
          <TouchableOpacity
            className="bg-primary py-5 px-6 rounded-2xl shadow-lg active:scale-95"
            onPress={() => router.push('/(auth)/login')}
            style={{ transform: [{ scale: 1 }] }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Autentificare
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border-2 border-primary py-5 px-6 rounded-2xl shadow-md active:scale-95"
            onPress={() => router.push('/(auth)/register')}
            style={{ transform: [{ scale: 1 }] }}
          >
            <Text className="text-primary text-center font-bold text-lg">
              Creează cont gratuit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 active:opacity-60"
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text className="text-gray-600 text-center font-medium">
              Explorează fără cont →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 items-center">
        <Text className="text-gray-400 text-sm mb-2">
          🇷🇴 Fabricat în România
        </Text>
        <Text className="text-gray-400 text-xs">
          © 2025 Prynt.ro • Toate drepturile rezervate
        </Text>
      </View>
    </View>
  );
}
