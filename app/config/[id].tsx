import React from 'react';
import { useLocalSearchParams } from 'expo-router';

// Import specific configurators
import BannerConfigurator from './banner';
import FlyereConfigurator from './flyere';
import PlianteConfigurator from './pliante';

// Fallback component for unsupported configurators
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function FallbackConfigurator({ id }: { id: string }) {
  const router = useRouter();

  const productNames: Record<string, string> = {
    autocolante: 'Autocolante',
    canvas: 'Canvas', 
    tapet: 'Tapet',
  };

  const productName = productNames[id] || 'Produs';

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-6 pb-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold mb-2">
          Configurator {productName}
        </Text>
        <Text className="text-blue-100">
          În curând disponibil
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-blue-100 p-6 rounded-full mb-6">
          <Ionicons name="construct" size={64} color="#0ea5e9" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
          În dezvoltare
        </Text>
        <Text className="text-gray-600 text-center text-base mb-8">
          Lucram la acest configurator.{'\n'}
          Momentan poți comanda prin website.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary py-4 px-8 rounded-xl"
        >
          <Text className="text-white font-semibold text-center">
            Înapoi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ConfiguratorScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;

  // Route to specific configurators
  switch (id) {
    case 'banner':
      return <BannerConfigurator />;
    case 'flayere': 
      return <FlyereConfigurator />;
    case 'pliante':
      return <PlianteConfigurator />;
    default:
      return <FallbackConfigurator id={id} />;
  }
}
