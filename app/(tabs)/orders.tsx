import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../lib/api';
import { isAuthenticated } from '../../lib/auth';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const authenticated = await isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await apiClient.getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'În așteptare';
      case 'processing':
        return 'În procesare';
      case 'completed':
        return 'Finalizată';
      case 'cancelled':
        return 'Anulată';
      default:
        return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="lock-closed" size={64} color="#9ca3af" />
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Autentificare necesară
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Pentru a vedea comenzile trebuie să te autentifici
        </Text>
        <TouchableOpacity
          className="bg-primary py-4 px-8 rounded-lg"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white font-semibold text-lg">
            Autentifică-te
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Se încarcă comenzile...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Comenzile mele
        </Text>

        {orders.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <Ionicons name="receipt-outline" size={64} color="#9ca3af" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Nicio comandă
            </Text>
            <Text className="text-gray-600 text-center">
              Nu ai plasat încă nicio comandă
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-xl p-5 shadow-sm"
                activeOpacity={0.7}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-lg font-semibold text-gray-900">
                      #{order.orderNumber}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    <Text className="text-xs font-medium">
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-3 mt-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">
                      {order.items?.length || 0} produse
                    </Text>
                    <Text className="text-xl font-bold text-primary">
                      {order.total?.toFixed(2)} RON
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
