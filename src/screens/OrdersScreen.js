import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getOrderList } from '../services/productServices';
import Loader from '../components/old_components/Loader';

const Container = styled.View`
  flex: 1;
  background-color: #8e8ca3;
  padding: 20px;
`;

const SearchBar = styled.View`
  background-color: #ffffff;
  padding: 10px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin-left: 10px;
`;

const OrderCard = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ProductCard = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Image = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-right: 10px;
`;

const OrderDetails = styled.View`
  flex: 1;
`;

const OrderStatusView = styled.View`
  background-color: #4caf50;
  padding: 5px 10px;
  border-radius: 20px;
  align-self: flex-start;
  margin-bottom: 5px;
`;

const OrderStatusText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 12px;
`;

const OrderInfo = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const OrderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #555;
`;

const Quantity = styled.Text`
  font-size: 14px;
  color: #777;
`;

const OrderScreen = () => {
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrderList();
  }, []);

  const fetchOrderList = async () => {
    setLoading(true);
    try {
      const res = await getOrderList();
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Error fetching product data:", err);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  console.log('Order List',orders)

  const handleOrderPress = (order) => {
    router.push({
      pathname: 'OrderDetails',
      params: {
        order: JSON.stringify(order), // Pass product details as a string
      },
    });
  };

  // console.log('Order List',orders[1].order_items)
  const renderOrderItem = ({ item }) => (
    <OrderCard onPress={() => handleOrderPress(item)}>
      <OrderDetails>
        <OrderInfo>Order ID: {item.id}</OrderInfo>
        <OrderTitle>Customer: {item.customer_name}</OrderTitle>
        <OrderInfo>Total: {item.currency_symbol}{item.total}</OrderInfo>
        
  
        {/* Render the order_items */}
        <OrderInfo>Items:</OrderInfo>
        {item.order_items.map((orderItem, index) => {
          
          const order = orderItem;
          const product = orderItem.product;
          return (
            
            <ProductCard key={index} style={{ marginTop: 10 }}>
              
              <Image source={{ uri: product.image }} resizeMode="cover" />
              <OrderDetails>
                <OrderTitle>{product.product_name}</OrderTitle>
                <OrderInfo>Category: {product.category}</OrderInfo>
                <OrderInfo>
                  Price: {item.currency_symbol}
                  {orderItem.price} (Discounted: {item.currency_symbol}
                  {product.discounted_price})
                </OrderInfo>
                <OrderInfo>Quantity: {orderItem.quantity}</OrderInfo>
                {/* <OrderInfo>Order Id: {orderItem.id}</OrderInfo> */}
              </OrderDetails>
            </ProductCard>
          );
        })}
      </OrderDetails>
      <OrderStatusView>
        <OrderStatusText>
          {item.is_over_due ? 'Overdue' : 'No-Overdue'}
        </OrderStatusText>
      </OrderStatusView>
    </OrderCard>
  );
  
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader visible={loading} />
      <HeaderComponent headerTitle="My Orders" onBackPress={() => navigation.goBack()} />
      <Container>
        <SearchBar>
          <Ionicons name="search" size={20} color="#333" />
          <SearchInput placeholder="Search" placeholderTextColor="#999" />
        </SearchBar>
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </SafeAreaView>
  );
};

export default OrderScreen;
