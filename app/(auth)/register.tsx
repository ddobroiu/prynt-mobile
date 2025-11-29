import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../lib/api';
import { saveToken, saveUser } from '../../lib/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Eroare', 'Parolele nu coincid');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Eroare', 'Parola trebuie să aibă minim 8 caractere');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.register({ name, email, password });
      
      if (response.token) {
        await saveToken(response.token);
        if (response.user) {
          await saveUser(response.user);
        }
        
        Alert.alert(
          'Succes', 
          'Contul a fost creat cu succes!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/home')
            }
          ]
        );
      } else {
        Alert.alert('Eroare', 'Înregistrare eșuată');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.';
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
            Creează cont
          </Text>
          <Text className="text-gray-600">
            Completează datele pentru a începe
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Nume</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Numele tău"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              editable={!isLoading}
            />
          </View>

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
              placeholder="Minim 8 caractere"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Confirmă parola</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Repetă parola"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            className="bg-primary py-4 rounded-lg mt-6"
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Creează cont
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Ai deja cont? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              disabled={isLoading}
            >
              <Text className="text-primary font-semibold">
                Autentifică-te
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
