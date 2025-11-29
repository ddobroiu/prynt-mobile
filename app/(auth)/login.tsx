import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../lib/api';
import { saveToken, saveUser } from '../../lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      
      if (response.token) {
        await saveToken(response.token);
        if (response.user) {
          await saveUser(response.user);
        }
        
        // Navigate to main app
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Eroare', 'Autentificare eșuată');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Eroare la autentificare. Verifică datele introduse.';
      Alert.alert('Eroare', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerClassName="px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Bun venit înapoi
          </Text>
          <Text className="text-gray-600">
            Intră în cont pentru a continua
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="nume@exemplu.ro"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Parolă</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            className="bg-primary py-4 rounded-lg mt-6"
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Autentificare
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Nu ai cont? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              disabled={isLoading}
            >
              <Text className="text-primary font-semibold">
                Înregistrează-te
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-2"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text className="text-gray-500 text-center">
              Înapoi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
