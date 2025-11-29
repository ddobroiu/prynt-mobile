import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUser, logout, isAuthenticated, User } from '../../lib/auth';

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const authenticated = await isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      const userData = await getUser();
      setUser(userData);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Deconectare',
      'Ești sigur că vrei să te deconectezi?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Deconectează-te',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-white">
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
              <Ionicons name="person" size={48} color="#9ca3af" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Cont neautentificat
            </Text>
            <Text className="text-gray-600 text-center">
              Autentifică-te pentru a accesa contul
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary py-4 rounded-lg mb-3"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Autentificare
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border-2 border-primary py-4 rounded-lg"
            onPress={() => router.push('/(auth)/register')}
          >
            <Text className="text-primary text-center font-semibold text-lg">
              Cont nou
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuItems = [
    { id: 'profile', title: 'Profilul meu', icon: 'person-outline' },
    { id: 'orders', title: 'Comenzile mele', icon: 'receipt-outline' },
    { id: 'addresses', title: 'Adrese', icon: 'location-outline' },
    { id: 'invoices', title: 'Facturi', icon: 'document-text-outline' },
    { id: 'settings', title: 'Setări', icon: 'settings-outline' },
    { id: 'help', title: 'Ajutor', icon: 'help-circle-outline' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center">
            <View className="bg-primary/10 p-6 rounded-full mb-4">
              <Ionicons name="person" size={48} color="#0ea5e9" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name || 'Utilizator'}
            </Text>
            <Text className="text-gray-600">
              {user?.email}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center p-5 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={24} color="#0ea5e9" />
              <Text className="flex-1 ml-4 text-gray-900 font-medium text-base">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-red-50 border border-red-200 py-4 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-red-600 text-center font-semibold text-lg">
            Deconectare
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-center text-sm mt-8">
          Versiunea 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
