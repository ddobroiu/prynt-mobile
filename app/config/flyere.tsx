"use client";

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react-native';

// Flyer configurator types based on web implementation
export type PriceInputFlyer = {
  sizeKey: string;
  quantity: number;
  twoSided: boolean;
  paperWeightKey: string;
  designOption: "upload" | "pro";
};

// Pricing data extracted from lib/pricing.ts
const FLYER_CONSTANTS = {
  SIZES: [
    {
      key: "A6",
      label: "A6",
      dims: "105 × 148 mm",
      brackets: [
        { max: 5000, oneSided: 0.22, twoSided: 0.28 },
        { max: Infinity, oneSided: 0.22, twoSided: 0.28 }
      ]
    },
    {
      key: "A5",
      label: "A5",
      dims: "148 × 210 mm",
      brackets: [
        { max: 5000, oneSided: 0.28, twoSided: 0.32 },
        { max: Infinity, oneSided: 0.28, twoSided: 0.32 }
      ]
    },
    {
      key: "21x10",
      label: "21 × 10 cm",
      dims: "210 × 100 mm",
      brackets: [
        { max: 5000, oneSided: 0.22, twoSided: 0.28 },
        { max: Infinity, oneSided: 0.22, twoSided: 0.28 }
      ]
    }
  ],
  PAPER_WEIGHTS: [
    { key: "135", label: "135 g/mp (Standard)", multiplier: 1.0 },
    { key: "250", label: "250 g/mp (Premium)", multiplier: 1.2 }
  ],
  PRO_FEE_PER_FACE: 50
};

const roundMoney = (num: number) => Math.round(num * 100) / 100;

const calculateFlyerPrice = (input: PriceInputFlyer) => {
  const sizeDef = FLYER_CONSTANTS.SIZES.find(x => x.key === input.sizeKey);
  const bracket = sizeDef?.brackets.find(b => input.quantity <= b.max) || sizeDef?.brackets[0];
  if (!bracket) return { finalPrice: 0, unitPrice: 0, proFee: 0 };

  const baseUnit = input.twoSided ? bracket.twoSided : bracket.oneSided;
  const multiplier = FLYER_CONSTANTS.PAPER_WEIGHTS.find(p => p.key === input.paperWeightKey)?.multiplier ?? 1;
  
  const unitPrice = roundMoney(baseUnit * multiplier);
  const proFee = input.designOption === "pro" ? 
    (input.twoSided ? FLYER_CONSTANTS.PRO_FEE_PER_FACE * 2 : FLYER_CONSTANTS.PRO_FEE_PER_FACE) : 0;
  
  return {
    finalPrice: roundMoney(unitPrice * input.quantity + proFee),
    unitPrice,
    proFee
  };
};

export default function FlyereConfigurator() {
  const router = useRouter();
  
  const [input, setInput] = useState<PriceInputFlyer>({
    sizeKey: "A6",
    quantity: 100,
    twoSided: false,
    paperWeightKey: "135",
    designOption: "upload"
  });

  const priceData = useMemo(() => calculateFlyerPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputFlyer>(k: K, v: PriceInputFlyer[K]) => {
    setInput(prev => ({ ...prev, [k]: v }));
  };

  const adjustQuantity = (delta: number) => {
    const newQty = Math.max(1, input.quantity + delta);
    updateInput('quantity', newQty);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (displayedTotal <= 0) {
      Alert.alert('Eroare', 'Prețul nu este calculat');
      return;
    }
    Alert.alert('Succes', `Flyere ${input.sizeKey} adăugate în coș!`);
  };

  const selectedSize = FLYER_CONSTANTS.SIZES.find(s => s.key === input.sizeKey);
  const selectedPaper = FLYER_CONSTANTS.PAPER_WEIGHTS.find(p => p.key === input.paperWeightKey);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Flyere Configurator</Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Hero Image */}
        <View className="bg-white m-4 rounded-xl overflow-hidden shadow-sm">
          <Image 
            source={{ uri: '/products/flayere/1.webp' }}
            className="w-full h-48"
            style={{ resizeMode: 'cover' }}
          />
        </View>

        {/* Size Selection */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Dimensiune</Text>
          <View className="gap-3">
            {FLYER_CONSTANTS.SIZES.map(size => (
              <TouchableOpacity 
                key={size.key}
                onPress={() => updateInput('sizeKey', size.key)}
                className={`p-4 rounded-lg border-2 ${
                  input.sizeKey === size.key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`font-semibold ${
                  input.sizeKey === size.key ? 'text-blue-700' : 'text-gray-900'
                }`}>{size.label}</Text>
                <Text className="text-sm text-gray-600 mt-1">{size.dims}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Paper Weight */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Hârtie</Text>
          <View className="gap-3">
            {FLYER_CONSTANTS.PAPER_WEIGHTS.map(paper => (
              <TouchableOpacity 
                key={paper.key}
                onPress={() => updateInput('paperWeightKey', paper.key)}
                className={`p-4 rounded-lg border-2 ${
                  input.paperWeightKey === paper.key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`font-medium ${
                  input.paperWeightKey === paper.key ? 'text-blue-700' : 'text-gray-900'
                }`}>{paper.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Tiraj</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">Cantitate (buc)</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => adjustQuantity(-50)}
                className="bg-gray-100 p-2 rounded-lg"
              >
                <Minus size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-bold min-w-16 text-center">{input.quantity}</Text>
              <TouchableOpacity 
                onPress={() => adjustQuantity(50)}
                className="bg-blue-100 p-2 rounded-lg"
              >
                <Plus size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
          
          {priceData.unitPrice > 0 && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              <Text className="text-sm text-gray-600">
                {formatPrice(priceData.unitPrice)}/buc × {input.quantity} buc = {formatPrice(priceData.unitPrice * input.quantity)}
              </Text>
              {priceData.proFee > 0 && (
                <Text className="text-sm text-gray-600 mt-1">
                  Design profesional: +{formatPrice(priceData.proFee)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Print Type */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Imprimare</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => updateInput('twoSided', false)}
              className={`flex-1 p-4 rounded-lg border-2 ${
                !input.twoSided 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-medium text-center ${
                !input.twoSided ? 'text-blue-700' : 'text-gray-900'
              }`}>Față</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => updateInput('twoSided', true)}
              className={`flex-1 p-4 rounded-lg border-2 ${
                input.twoSided 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-medium text-center ${
                input.twoSided ? 'text-blue-700' : 'text-gray-900'
              }`}>Față-verso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Design Option */}
        <View className="bg-white mx-4 mb-6 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Grafică</Text>
          <View className="gap-3">
            <TouchableOpacity 
              onPress={() => updateInput('designOption', 'upload')}
              className={`p-4 rounded-lg border-2 ${
                input.designOption === 'upload' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-medium ${
                input.designOption === 'upload' ? 'text-blue-700' : 'text-gray-900'
              }`}>Grafică proprie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => updateInput('designOption', 'pro')}
              className={`p-4 rounded-lg border-2 ${
                input.designOption === 'pro' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-medium ${
                input.designOption === 'pro' ? 'text-blue-700' : 'text-gray-900'
              }`}>
                Design profesional (+{formatPrice(input.twoSided ? FLYER_CONSTANTS.PRO_FEE_PER_FACE * 2 : FLYER_CONSTANTS.PRO_FEE_PER_FACE)})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Price & Add to Cart */}
      <View className="bg-white px-4 py-3 border-t border-gray-200 shadow-lg">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-gray-900">
            {formatPrice(displayedTotal)}
          </Text>
          <TouchableOpacity 
            onPress={handleAddToCart}
            disabled={displayedTotal <= 0}
            className={`flex-row items-center px-6 py-3 rounded-lg ${
              displayedTotal > 0 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            }`}
          >
            <ShoppingCart size={20} color="white" />
            <Text className="text-white font-bold ml-2">Adaugă în Coș</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-sm text-gray-600 text-center">
          Flyere {selectedSize?.label} • {selectedPaper?.label} • {input.twoSided ? 'Față-verso' : 'Față'} • {input.quantity} buc.
        </Text>
      </View>
    </View>
  );
}