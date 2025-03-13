import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ProductDetailsScreen from '../../src/screens/ProductDetailsScreen';

const Index = () => {
  const route = useRoute();
  const product_data = route?.params?.product; // Ensure proper access to product_data

  if (!product_data) {
    console.error('No product data passed!');
  }

  return (
    <View style={{ flex: 1 }}>
      <ProductDetailsScreen product_data={product_data} />
    </View>
  );
};

export default Index;
