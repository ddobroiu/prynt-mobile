import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Mail, 
  MapPin, 
  Package, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Deconectare',
      'Ești sigur că vrei să te deconectezi?',
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: 'Deconectare', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <User size={64} color="#6B7280" />
          <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
            Nu ești conectat
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Conectează-te pentru a vedea contul tău și comenzile
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-8 py-3 rounded-lg"
            onPress={() => router.push('/login')}
          >
            <Text className="text-white font-semibold">Conectare</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header Profile */}
        <View className="bg-white px-6 py-8">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
              <User size={32} color="#3B82F6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-semibold text-gray-900">
                {user.name || 'Utilizator'}
              </Text>
              <Text className="text-gray-600 mt-1">
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-6">
          {/* Profile Settings */}
          <View className="bg-white">
            <TouchableOpacity
              className="flex-row items-center px-6 py-4 border-b border-gray-100"
              onPress={() => {
                // TODO: Navigate to profile edit screen
                Alert.alert('Info', 'Editarea profilului va fi implementată în curând');
              }}
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Settings size={20} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-medium">Date personale</Text>
                <Text className="text-gray-500 text-sm">Editează numele și email-ul</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-6 py-4 border-b border-gray-100"
              onPress={() => {
                // TODO: Navigate to addresses screen
                Alert.alert('Info', 'Adresele vor fi implementate în curând');
              }}
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <MapPin size={20} color="#10B981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-medium">Adresele mele</Text>
                <Text className="text-gray-500 text-sm">Gestionează adresele de livrare</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-6 py-4"
              onPress={() => {
                // TODO: Navigate to orders screen
                Alert.alert('Info', 'Comenzile vor fi implementate în curând');
              }}
            >
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                <Package size={20} color="#F59E0B" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-medium">Comenzile mele</Text>
                <Text className="text-gray-500 text-sm">Istoric și status comenzi</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions */}
        <View className="mt-6 bg-white">
          <TouchableOpacity
            className="flex-row items-center px-6 py-4"
            onPress={handleLogout}
          >
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
              <LogOut size={20} color="#EF4444" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-red-600 font-medium">Deconectare</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-8 px-6 pb-8">
          <Text className="text-center text-gray-500 text-sm">
            Prynt Mobile v1.0.0
          </Text>
          <Text className="text-center text-gray-400 text-xs mt-1">
            © 2025 Prynt. Toate drepturile rezervate.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
