"use client";

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react-native';

// Pliante configurator types based on web implementation
export type PlianteFoldType = "simplu" | "fereastra" | "paralel" | "fluture";
export type PlianteWeightKey = "115" | "170" | "250";

export type PriceInputPliante = {
  weight: PlianteWeightKey;
  quantity: number;
  fold: PlianteFoldType;
  designOption: "upload" | "pro";
};

// Pricing data extracted from lib/pricing.ts
const PLIANTE_CONSTANTS = {
  FOLDS: {
    simplu: { label: "1 big (Simplu)", open: "297×210mm", closed: "148.5×210mm" },
    fereastra: { label: "2 biguri (Fereastră)", open: "297×210mm", closed: "148.5×210mm" },
    paralel: { label: "3 biguri (Paralel)", open: "297×210mm", closed: "75×210mm" },
    fluture: { label: "4 biguri (Fluture)", open: "297×210mm", closed: "74.25×210mm" }
  } as Record<PlianteFoldType, { label: string; open: string; closed: string }>,
  PRICE_TABLE: {
    "115": [{ min: 1, price: 3.2 }],
    "170": [{ min: 1, price: 3.5 }],
    "250": [{ min: 1, price: 3.7 }]
  } as Record<PlianteWeightKey, { min: number; price: number }[]>,
  PRO_FEES: {
    simplu: 100,
    fereastra: 135,
    paralel: 175,
    fluture: 200
  } as Record<PlianteFoldType, number>
};

const roundMoney = (num: number) => Math.round(num * 100) / 100;

const calculatePliantePrice = (input: PriceInputPliante) => {
  const tiers = PLIANTE_CONSTANTS.PRICE_TABLE[input.weight];
  const unitBasePrice = tiers[0].price;
  const subtotal = roundMoney(unitBasePrice * input.quantity);
  const proFee = input.designOption === "pro" ? 
    (PLIANTE_CONSTANTS.PRO_FEES[input.fold] ?? 0) : 0;
  
  return {
    finalPrice: roundMoney(subtotal + proFee),
    unitPrice: unitBasePrice,
    proFee
  };
};

export default function PlianteConfigurator() {
  const router = useRouter();
  
  const [input, setInput] = useState<PriceInputPliante>({
    weight: "170",
    quantity: 100,
    fold: "simplu",
    designOption: "upload"
  });

  const priceData = useMemo(() => calculatePliantePrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputPliante>(k: K, v: PriceInputPliante[K]) => {
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
    Alert.alert('Succes', `Pliante ${PLIANTE_CONSTANTS.FOLDS[input.fold].label} adăugate în coș!`);
  };

  const selectedFold = PLIANTE_CONSTANTS.FOLDS[input.fold];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Pliante Configurator</Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Hero Image */}
        <View className="bg-white m-4 rounded-xl overflow-hidden shadow-sm">
          <Image 
            source={{ uri: '/products/pliante/1.webp' }}
            className="w-full h-48"
            style={{ resizeMode: 'cover' }}
          />
        </View>

        {/* Fold Type Selection */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Tip Îndoire</Text>
          <View className="gap-3">
            {Object.entries(PLIANTE_CONSTANTS.FOLDS).map(([foldKey, foldData]) => (
              <TouchableOpacity 
                key={foldKey}
                onPress={() => updateInput('fold', foldKey as PlianteFoldType)}
                className={`p-4 rounded-lg border-2 ${
                  input.fold === foldKey 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`font-semibold ${
                  input.fold === foldKey ? 'text-blue-700' : 'text-gray-900'
                }`}>{foldData.label}</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Deschis: {foldData.open} → Închis: {foldData.closed}
                </Text>
                {input.designOption === 'pro' && (
                  <Text className="text-xs text-blue-600 mt-1">
                    Design: +{formatPrice(PLIANTE_CONSTANTS.PRO_FEES[foldKey as PlianteFoldType])}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Paper Weight */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Gramaj Hârtie</Text>
          <View className="gap-3">
            {Object.entries(PLIANTE_CONSTANTS.PRICE_TABLE).map(([weight, tiers]) => (
              <TouchableOpacity 
                key={weight}
                onPress={() => updateInput('weight', weight as PlianteWeightKey)}
                className={`p-4 rounded-lg border-2 ${
                  input.weight === weight 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`font-semibold ${
                  input.weight === weight ? 'text-blue-700' : 'text-gray-900'
                }`}>{weight} g/mp</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {formatPrice(tiers[0].price)}/buc
                  {weight === '115' && ' (Economic)'}
                  {weight === '170' && ' (Standard)'}
                  {weight === '250' && ' (Premium)'}
                </Text>
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
                onPress={() => adjustQuantity(-25)}
                className="bg-gray-100 p-2 rounded-lg"
              >
                <Minus size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-bold min-w-16 text-center">{input.quantity}</Text>
              <TouchableOpacity 
                onPress={() => adjustQuantity(25)}
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
                  Design {selectedFold.label}: +{formatPrice(priceData.proFee)}
                </Text>
              )}
            </View>
          )}
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
                Design profesional (+{formatPrice(PLIANTE_CONSTANTS.PRO_FEES[input.fold])})
              </Text>
              <Text className="text-xs text-gray-600 mt-1">
                Prețul variază în funcție de complexitate ({selectedFold.label})
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
          Pliante {selectedFold.label} • {input.weight}g • {input.quantity} buc.
        </Text>
      </View>
    </View>
  );
}