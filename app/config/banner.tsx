"use client";

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react-native';

// Banner configurator types based on web implementation
export type PriceInputBanner = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "frontlit_440" | "frontlit_510";
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
  designOption: "upload" | "pro" | "text_only";
};

// Pricing logic extracted from lib/pricing.ts
const BANNER_CONSTANTS = {
  PRICES: {
    bands: [
      { max: 1, price: 100 },
      { max: 5, price: 75 },
      { max: 20, price: 60 },
      { max: 50, price: 45 },
      { max: Infinity, price: 35 }
    ],
    multipliers: {
      frontlit_510: 1.15,
      hem_grommets: 1.10,
      wind_holes: 1.10
    }
  },
  PRO_DESIGN_FEE: 50
};

const roundMoney = (num: number) => Math.round(num * 100) / 100;

const calculateBannerPrice = (input: PriceInputBanner) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { finalPrice: 0, total_sqm: 0, pricePerSqm: 0 };
  }
  
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);

  // Base Price Band
  let basePrice = 35;
  for (const band of BANNER_CONSTANTS.PRICES.bands) {
    if (total_sqm <= band.max) {
      basePrice = band.price;
      break;
    }
  }

  // Multipliers
  let multiplier = 1;
  if (input.material === "frontlit_510") multiplier *= BANNER_CONSTANTS.PRICES.multipliers.frontlit_510;
  if (input.want_hem_and_grommets) multiplier *= BANNER_CONSTANTS.PRICES.multipliers.hem_grommets;
  if (input.want_wind_holes) multiplier *= BANNER_CONSTANTS.PRICES.multipliers.wind_holes;

  const pricePerSqm = roundMoney(basePrice * multiplier);
  let finalPrice = roundMoney(total_sqm * pricePerSqm);

  // Design Fee
  if (input.designOption === "pro") {
    finalPrice += BANNER_CONSTANTS.PRO_DESIGN_FEE;
  }

  return { finalPrice: roundMoney(finalPrice), total_sqm: roundMoney(total_sqm), pricePerSqm };
};

export default function BannerConfigurator() {
  const router = useRouter();
  
  const [input, setInput] = useState<PriceInputBanner>({
    width_cm: 200,
    height_cm: 100,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
    designOption: "upload"
  });

  const [widthText, setWidthText] = useState("200");
  const [heightText, setHeightText] = useState("100");

  const priceData = useMemo(() => calculateBannerPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputBanner>(k: K, v: PriceInputBanner[K]) => {
    setInput(prev => ({ ...prev, [k]: v }));
  };

  const handleDimensionChange = (value: string, type: 'width' | 'height') => {
    const numValue = parseFloat(value) || 0;
    if (type === 'width') {
      setWidthText(value);
      updateInput('width_cm', numValue);
    } else {
      setHeightText(value);
      updateInput('height_cm', numValue);
    }
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
      Alert.alert('Eroare', 'Prețul trebuie calculat înainte de a adăuga în coș.');
      return;
    }
    Alert.alert('Succes', 'Banner adăugat în coș!');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Banner Configurator</Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Hero Image */}
        <View className="bg-white m-4 rounded-xl overflow-hidden shadow-sm">
          <Image 
            source={{ uri: '/products/banner/1.webp' }}
            className="w-full h-48"
            style={{ resizeMode: 'cover' }}
          />
        </View>

        {/* Dimensions */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Dimensiuni (cm)</Text>
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Lungime</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                value={widthText}
                onChangeText={(value) => handleDimensionChange(value, 'width')}
                keyboardType="numeric"
                placeholder="200"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Înălțime</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                value={heightText}
                onChangeText={(value) => handleDimensionChange(value, 'height')}
                keyboardType="numeric"
                placeholder="100"
              />
            </View>
          </View>
          
          {/* Quantity */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">Cantitate</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => adjustQuantity(-1)}
                className="bg-gray-100 p-2 rounded-lg"
              >
                <Minus size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-bold min-w-12 text-center">{input.quantity}</Text>
              <TouchableOpacity 
                onPress={() => adjustQuantity(1)}
                className="bg-blue-100 p-2 rounded-lg"
              >
                <Plus size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
          
          {priceData.total_sqm > 0 && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              <Text className="text-sm text-gray-600">
                Total: {priceData.total_sqm} mp × {formatPrice(priceData.pricePerSqm)}/mp
              </Text>
            </View>
          )}
        </View>

        {/* Material Selection */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Material</Text>
          <View className="gap-3">
            <TouchableOpacity 
              onPress={() => updateInput('material', 'frontlit_440')}
              className={`p-4 rounded-lg border-2 ${
                input.material === 'frontlit_440' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-semibold ${
                input.material === 'frontlit_440' ? 'text-blue-700' : 'text-gray-900'
              }`}>Frontlit 440g (Standard)</Text>
              <Text className="text-sm text-gray-600 mt-1">
                Material PVC flexibil și rezistent, ideal pentru uz exterior
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => updateInput('material', 'frontlit_510')}
              className={`p-4 rounded-lg border-2 ${
                input.material === 'frontlit_510' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`font-semibold ${
                input.material === 'frontlit_510' ? 'text-blue-700' : 'text-gray-900'
              }`}>Frontlit 510g (Premium)</Text>
              <Text className="text-sm text-gray-600 mt-1">
                Material mai gros și durabil, perfect pentru utilizare pe termen lung
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Finishes */}
        <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Finisaje</Text>
          
          <TouchableOpacity 
            onPress={() => updateInput('want_hem_and_grommets', !input.want_hem_and_grommets)}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Tiv și capse metalice</Text>
              <Text className="text-sm text-gray-600">Recomandat pentru toate bannerele</Text>
            </View>
            <View className={`w-6 h-6 rounded border-2 items-center justify-center ${
              input.want_hem_and_grommets 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
              {input.want_hem_and_grommets && (
                <Text className="text-white font-bold text-xs">✓</Text>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => updateInput('want_wind_holes', !input.want_wind_holes)}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Găuri de vânt</Text>
              <Text className="text-sm text-gray-600">Pentru zonele cu vânt puternic</Text>
            </View>
            <View className={`w-6 h-6 rounded border-2 items-center justify-center ${
              input.want_wind_holes 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
              {input.want_wind_holes && (
                <Text className="text-white font-bold text-xs">✓</Text>
              )}
            </View>
          </TouchableOpacity>
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
              }`}>Design profesional (+{formatPrice(BANNER_CONSTANTS.PRO_DESIGN_FEE)})</Text>
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
        
        {input.width_cm > 0 && input.height_cm > 0 && (
          <Text className="text-sm text-gray-600 text-center">
            Banner {input.width_cm}×{input.height_cm} cm • {input.quantity} buc.
          </Text>
        )}
      </View>
    </View>
  );
}