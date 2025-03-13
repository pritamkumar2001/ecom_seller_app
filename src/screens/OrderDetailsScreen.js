import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, FlatList, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const AnimatedItemContainer = Animated.createAnimatedComponent(styled.View`
  width: ${width - 40}px; /* Full width minus padding */
  align-items: center;
  margin-bottom: 30px;
`);

const OrderImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrderDetails = styled.View`
  width: 100%;
  background-color: #e0f7fa;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const OrderText = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

const AnimatedButton = Animated.createAnimatedComponent(styled.TouchableOpacity`
  background-color: ${(props) => props.bgColor || '#00c853'};
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-top: ${(props) => (props.isSecondary ? '10px' : '0')};
`);

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const OrderDetailsScreen = ({ order_data }) => {
  
  const navigation = useNavigation();
  const parsedOrder = typeof order_data === 'string' ? JSON.parse(order_data) : order_data;

  // Animation Shared Value
  const itemOpacity = useSharedValue(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Animation Style
  const animatedItemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: withTiming(itemOpacity.value * 10, { duration: 500 }) }],
  }));

  // Animate items on mount
  useEffect(() => {
    itemOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  // Button Animation
  const handlePressIn = (scale) => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = (scale) => {
    scale.value = withTiming(1, { duration: 100 });
  };

  if (!parsedOrder || !parsedOrder.id) {
    return (
      <Container>
        <OrderText>No order details available</OrderText>
      </Container>
    );
  }

  const renderOrderItem = ({ item }) => {
    const product = item.product;
    return (
      <AnimatedItemContainer style={animatedItemStyle}>
        {product.image && (
          <OrderImage source={{ uri: product.image }} style={{ resizeMode: 'contain' }} />
        )}
        <OrderDetails>
          <OrderText>Product: {product.product_name}</OrderText>
          <OrderText>Category: {product.category}</OrderText>
          <OrderText>Price: ₹{product.selling_price}</OrderText>
          {/* <OrderText>Discounted Price: ₹{product.discounted_price}</OrderText> */}
          <OrderText>Quantity: {item.quantity}</OrderText>
          <OrderText>Tax Rate: {item.tax_rate}%</OrderText>
          <OrderText>Final Price: ₹{item.final_price}</OrderText>
        </OrderDetails>
      </AnimatedItemContainer>
    );
  };

  // Animated Button Styles
  const acceptButtonScale = useSharedValue(1);
  const denyButtonScale = useSharedValue(1);

  const animatedAcceptButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: acceptButtonScale.value }],
  }));

  const animatedDenyButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: denyButtonScale.value }],
  }));

  return (
    <>
    
    
    <HeaderComponent headerTitle="My Orders" onBackPress={() => navigation.goBack()} />
    {/* <ScrollView> */}
      <Container>
        <OrderText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Order Details
        </OrderText>
        <OrderText>Order ID: {parsedOrder.invoice_number}</OrderText>
        <OrderText>Customer: {parsedOrder.customer_name}</OrderText>
        <OrderText>Outstanding Amount: {parsedOrder.outstanding_amt}</OrderText>
        <OrderText>Invoice Date: {parsedOrder.invoice_date}</OrderText>
        <OrderText>Due Date: {parsedOrder.invoice_due_date}</OrderText>

        <FlatList
          data={parsedOrder.order_items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <ButtonContainer>
          <AnimatedButton
            bgColor="#00c853"
            onPressIn={() => handlePressIn(acceptButtonScale)}
            onPressOut={() => handlePressOut(acceptButtonScale)}
            style={animatedAcceptButtonStyle}
          >
            <ButtonText>Accept Order Request</ButtonText>
          </AnimatedButton>
          <AnimatedButton
            bgColor="#d50000"
            isSecondary
            onPressIn={() => handlePressIn(denyButtonScale)}
            onPressOut={() => handlePressOut(denyButtonScale)}
            style={animatedDenyButtonStyle}
          >
            <ButtonText>Deny Order Request</ButtonText>
          </AnimatedButton>
        </ButtonContainer>
      </Container>
    {/* </ScrollView> */}
    </>
  );
};

export default OrderDetailsScreen;
