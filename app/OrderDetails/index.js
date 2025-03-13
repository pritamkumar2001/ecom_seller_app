import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import OrderDetailsScreen from '../../src/screens/OrderDetailsScreen';

const Index = () => {
  const route = useRoute(); // Access route object from navigation
  const order_data = route?.params?.order; // Safely access the order data passed through params

  // console.log("Order Data===",order_data)

  if (!order_data) {
    console.error('No order data passed!');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No order data found!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <OrderDetailsScreen order_data={order_data} />
    </View>
  );
};

export default Index;
