import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const configurators = [
    { id: 'afise', title: 'Afișe', icon: 'image', status: '✅', description: 'A3, A2, A1, A0' },
    { id: 'banner', title: 'Bannere', icon: 'flag', status: '✅', description: 'Frontlit 440g/510g' },
    { id: 'flayere', title: 'Flyere', icon: 'documents', status: '✅', description: 'A6, A5, 21×10cm' },
    { id: 'pliante', title: 'Pliante', icon: 'book', status: '✅', description: 'Biguite 1-4 fețe' },
    { id: 'autocolante', title: 'Autocolante', icon: 'pricetag', status: '🚧', description: 'În dezvoltare' },
    { id: 'canvas', title: 'Canvas', icon: 'color-palette', status: '🚧', description: 'În dezvoltare' },
    { id: 'tapet', title: 'Tapet', icon: 'grid', status: '🚧', description: 'În dezvoltare' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <View className="bg-primary px-6 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <Text className="text-white text-3xl font-bold mb-2">
          👋 Bun venit!
        </Text>
        <Text className="text-blue-100 text-base">
          Alege produsul și începe comanda
        </Text>
      </View>

      <View className="px-6 py-6">
        {/* Products Grid */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Configuratoare disponibile
          </Text>
          
          <View className="space-y-3">
            {configurators.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/config/${item.id}` as any)}
                className="bg-white rounded-2xl p-5 flex-row items-center shadow-md active:scale-98"
                activeOpacity={0.8}
                style={{ 
                  transform: [{ scale: 1 }],
                  shadowColor: '#0ea5e9',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <View className="bg-blue-100 p-4 rounded-xl mr-4">
                  <Ionicons name={item.icon as any} size={32} color="#0ea5e9" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-gray-900 mr-2">
                      {item.title}
                    </Text>
                    <Text className="text-base">{item.status}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {item.description}
                  </Text>
                </View>
                <View className="bg-primary/10 p-2 rounded-full">
                  <Ionicons name="arrow-forward" size={20} color="#0ea5e9" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View className="bg-blue-500 p-6 rounded-2xl shadow-lg mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-white/20 p-2 rounded-full mr-3">
              <Ionicons name="rocket" size={24} color="white" />
            </View>
            <Text className="text-xl font-bold text-white">
              Livrare rapidă
            </Text>
          </View>
          <Text className="text-blue-50 leading-6">
            Tipărire profesională cu livrare în toată România. Preview instant și calcul automat al prețului.
          </Text>
        </View>

        {/* Features */}
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-2xl mb-1">⚡</Text>
            <Text className="text-sm font-semibold text-gray-900">Rapid</Text>
            <Text className="text-xs text-gray-500">Comenzi în 2 minute</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-2xl mb-1">✨</Text>
            <Text className="text-sm font-semibold text-gray-900">Calitate</Text>
            <Text className="text-xs text-gray-500">Materiale premium</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-2xl mb-1">🚚</Text>
            <Text className="text-sm font-semibold text-gray-900">Livrare</Text>
            <Text className="text-xs text-gray-500">În toată țara</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
