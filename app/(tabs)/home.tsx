import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const configurators = [
    { id: 'afise', title: 'Afișe', icon: 'image' },
    { id: 'banner', title: 'Bannere', icon: 'flag' },
    { id: 'flayere', title: 'Flyere', icon: 'documents' },
    { id: 'pliante', title: 'Pliante', icon: 'book' },
    { id: 'autocolante', title: 'Autocolante', icon: 'pricetag' },
    { id: 'canvas', title: 'Canvas', icon: 'color-palette' },
    { id: 'tapet', title: 'Tapet', icon: 'grid' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Bun venit la Prynt
          </Text>
          <Text className="text-gray-600 text-lg">
            Alege tipul de produs dorit
          </Text>
        </View>

        <View className="space-y-3">
          {configurators.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex-row items-center shadow-sm"
              activeOpacity={0.7}
            >
              <View className="bg-primary/10 p-3 rounded-lg mr-4">
                <Ionicons name={item.icon as any} size={28} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Configurează și comandă
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-8 bg-primary/5 p-6 rounded-xl">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={24} color="#0ea5e9" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">
              Informații
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            Tipărire profesională cu livrare rapidă în toată România. 
            Comenzi personalizate cu preview instant și calculare automată a prețului.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
