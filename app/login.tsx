import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  const { login, register, isLoading, error, clearError } = useAuth();

  // Clear error when switching tabs
  React.useEffect(() => {
    clearError();
  }, [activeTab]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Eroare', 'Te rog să completezi toate câmpurile');
      return;
    }

    const success = await login(loginEmail, loginPassword);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !registerName) {
      Alert.alert('Eroare', 'Te rog să completezi toate câmpurile');
      return;
    }

    if (registerPassword.length < 8) {
      Alert.alert('Eroare', 'Parola trebuie să aibă minim 8 caractere');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('Eroare', 'Parolele nu se potrivesc');
      return;
    }

    const success = await register(registerEmail, registerPassword, registerName);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          {/* Header */}
          <View className="items-center py-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Bun venit la Prynt
            </Text>
            <Text className="text-gray-600 text-center">
              Conectează-te sau creează un cont pentru a continua
            </Text>
          </View>

          {/* Tab Buttons */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                activeTab === 'login' ? 'bg-white shadow-sm' : ''
              }`}
              onPress={() => setActiveTab('login')}
            >
              <Text className={`text-center font-medium ${
                activeTab === 'login' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Conectare
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                activeTab === 'register' ? 'bg-white shadow-sm' : ''
              }`}
              onPress={() => setActiveTab('register')}
            >
              <Text className={`text-center font-medium ${
                activeTab === 'register' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Înregistrare
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="adresa@email.com"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Parolă</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-blue-600 rounded-lg py-4 mt-6 ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Conectare
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <View className="space-y-4">
              {/* Name Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Nume complet</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <User size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="Numele tău"
                    value={registerName}
                    onChangeText={setRegisterName}
                    autoComplete="name"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="adresa@email.com"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Parolă</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="Minim 8 caractere"
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Confirmă parola</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`bg-blue-600 rounded-lg py-4 mt-6 ${
                  isLoading ? 'opacity-50' : ''
                }`}
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
            </View>
          )}

          {/* Footer */}
          <View className="py-8">
            <Text className="text-gray-500 text-center text-sm">
              Prin continuare, ești de acord cu{'\n'}
              <Text className="text-blue-600">Termenii și Condițiile</Text> și{' '}
              <Text className="text-blue-600">Politica de Confidențialitate</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}