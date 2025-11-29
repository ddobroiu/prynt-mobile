import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SIZES = [
  { key: "A3", label: "A3", dims: "297×420 mm" },
  { key: "A2", label: "A2", dims: "420×594 mm" },
  { key: "A1", label: "A1", dims: "594×841 mm" },
  { key: "A0", label: "A0", dims: "841×1189 mm" },
  { key: "S5", label: "S5", dims: "500×700 mm" },
  { key: "S7", label: "S7", dims: "700×1000 mm" },
];

const MATERIALS = [
  { key: "paper_150_lucioasa", label: "Hârtie 150g lucioasă", description: "Standard" },
  { key: "paper_150_mata", label: "Hârtie 150g mată", description: "Elegant" },
  { key: "paper_300_lucioasa", label: "Carton 300g lucios", description: "Rigid" },
  { key: "paper_300_mata", label: "Carton 300g mat", description: "Premium" },
  { key: "blueback_115", label: "Blueback 115g", description: "Outdoor" },
  { key: "whiteback_150_material", label: "Whiteback 150g", description: "Indoor" },
  { key: "satin_170", label: "Satin 170g", description: "Foto" },
  { key: "foto_220", label: "Hârtie Foto 220g", description: "Foto Premium" },
];

const PRICE_TABLE: Record<string, Record<string, number>> = {
  paper_150_lucioasa: { A3: 3.0, A2: 9.98, A1: 39.96, A0: 80.0, S5: 28.0, S7: 56.0 },
  paper_150_mata: { A3: 3.0, A2: 9.98, A1: 39.96, A0: 80.0, S5: 28.0, S7: 56.0 },
  blueback_115: { A0: 70.0, A1: 17.48, A2: 17.46 },
  whiteback_150_material: { A0: 80.0 },
};

const calculatePrice = (size: string, material: string, quantity: number): number => {
  let matKey = material;
  let multiplier = 1;
  
  // Carton 300g = 2x față de hârtie 150g
  if (material.startsWith("paper_300")) {
    matKey = material.includes("lucioasa") ? "paper_150_lucioasa" : "paper_150_mata";
    multiplier = 2;
  }
  
  let basePrice = 10;
  if (PRICE_TABLE[matKey] && PRICE_TABLE[matKey][size]) {
    basePrice = PRICE_TABLE[matKey][size];
  }
  
  const unitPrice = basePrice * multiplier;
  return parseFloat((unitPrice * quantity).toFixed(2));
};

export default function AfiseConfigScreen() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // A2 default
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [quantity, setQuantity] = useState(50);

  const price = calculatePrice(selectedSize.key, selectedMaterial.key, quantity);
  const unitPrice = (price / quantity).toFixed(2);

  const handleAddToCart = () => {
    Alert.alert(
      'Adăugat în coș!',
      `Afiș ${selectedSize.label} - ${selectedMaterial.label}\n${quantity} buc × ${unitPrice} RON\nTotal: ${price.toFixed(2)} RON`,
      [
        { text: 'Continuă cumpărăturile', style: 'cancel' },
        { text: 'Vezi coșul', onPress: () => router.push('/(tabs)/orders') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold mb-2">
            Configurator Afișe
          </Text>
          <Text className="text-blue-100">
            Personalizează afișul tău
          </Text>
        </View>

        <View className="px-6 py-6">
          {/* Material Selection */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Material
            </Text>
            <View className="space-y-3">
              {MATERIALS.map((material) => (
                <TouchableOpacity
                  key={material.key}
                  onPress={() => setSelectedMaterial(material)}
                  className={`p-4 rounded-xl border-2 ${
                    selectedMaterial.key === material.key
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className={`text-base font-semibold ${
                        selectedMaterial.key === material.key ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {material.label}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {material.description}
                      </Text>
                    </View>
                    {selectedMaterial.key === material.key && (
                      <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Dimensiune
            </Text>
            <View className="space-y-3">
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size.key}
                  onPress={() => setSelectedSize(size)}
                  className={`p-4 rounded-xl border-2 ${
                    selectedSize.key === size.key
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className={`text-base font-semibold ${
                        selectedSize.key === size.key ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {size.label}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {size.dims}
                      </Text>
                    </View>
                    {selectedSize.key === size.key && (
                      <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Cantitate
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border-2 border-gray-200 p-2">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 10))}
                className="bg-gray-100 p-3 rounded-lg"
              >
                <Ionicons name="remove" size={24} color="#374151" />
              </TouchableOpacity>
              <Text className="flex-1 text-center text-xl font-bold text-gray-900">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 10)}
                className="bg-primary p-3 rounded-lg"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Summary */}
          <View className="bg-blue-500 p-6 rounded-2xl mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-blue-100 text-sm">Preț unitar</Text>
                <Text className="text-white text-lg font-bold">{unitPrice} RON/buc</Text>
              </View>
              <View className="items-end">
                <Text className="text-blue-100 text-sm">Total</Text>
                <Text className="text-white text-3xl font-bold">
                  {price.toFixed(2)} RON
                </Text>
              </View>
            </View>
            <Text className="text-blue-100 text-sm">
              {quantity} buc × {selectedSize.label} ({selectedMaterial.label})
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="bg-white border-t border-gray-200 p-6">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-primary py-5 rounded-2xl shadow-lg active:scale-98"
        >
          <Text className="text-white text-center font-bold text-lg">
            Adaugă în coș • {price.toFixed(2)} RON
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
