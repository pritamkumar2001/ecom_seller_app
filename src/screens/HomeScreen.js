import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { getProfileInfo } from '../services/authServices';

const Container = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`

  background-color: #848598;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const HeaderText = styled.View`
  flex-direction: column;
`;

const Greeting = styled.Text`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: -5px;
`;

const NameText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;

const NotificationIcon = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  position: relative;
`;

const StorefrontImage = styled.TouchableOpacity`
  height: 185px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Badge = styled.View`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background-color: #333;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: #fff;
  font-size: 12px;
`;

const OrderSummary = styled.TouchableOpacity`
  /* background-color: #d9d9e3; */
  border: 1px solid white;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 10px;
  margin-bottom: 20px;
`;
const OrderSummaryTextArea = styled.View`
  /* background-color: #d9d9e3; */
  /* padding: 15px; */
  display: flex;
  align-items: baseline;
  /* justify-content: first baseline; */
  border-radius: 10px;
  /* margin-bottom: 20px; */
`;

const OrderSummaryHeading = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

const OrderSummaryText = styled.Text`
  font-size: 16px;
  color: #fff;
  /* font-weight: bold; */
  text-align: center;
`;

const OrderAmount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #e68a00;
  /* margin-top: 10px; */
  text-align: center;
`;
const OrderAmountArea = styled.View`
  /* background-color: #fff; */
  padding: 20px;
  background-color: #e0e0e0;
  /* padding-left: 4px;
  padding-right: 4px; */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid white;
  /* margin-bottom: 20px; */
`;

const OrderList = styled.View`
  /* background-color: #ffffff; */
  border: 1px solid white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const OrderListTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const OrderItem = styled.View`
  background-color: #e0e0e0;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const OrderItemText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Settlement = styled.View`
  /* background-color: #fff; */
  /* padding: 15px; */
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  justify-content: space-between;
  margin-bottom: 30px;
  border: 1px solid white;
`;

const SettlementAmountArea = styled.View`
  background-color: #e0e0e0;
  padding: 15px;
  border-radius: 0px 10px 10px 0px;
  height: 100%;
  /* margin-bottom: 30px; */
`;

const SettlementText = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

const SettlementAmount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #e68a00;
`;
const SettlementAmountText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #454545;
`;

const HomePage = () => {
  const imagePath = require('../../assets/images/StoreImage.png');
  const notificationIcon = require('../../assets/images/bell.png');
  const notificationIconWithBadge = require('../../assets/images/bellwithnotification.png');
  const hasNotifications = false;
  const router = useRouter();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getProfileInfo().then((res) => {
      setProfile(res.data);
    });
  }, []);


  const handlePressProducts = () => {
    router.push('products');
  };

  const handlePressOrders = () => {
    router.push('orders');
  };


  return (
    <Container>
      <StatusBar barStyle={'light-content'} backgroundColor={'#848598'} />
      <Header>
        <HeaderText>
          <Greeting>Hello,</Greeting>
          <NameText>{profile?.emp_data?.name}</NameText>
        </HeaderText>
        <NotificationIcon onPress={() => router.push({ pathname: 'Notification'})}>
          <Image
            source={hasNotifications ? notificationIconWithBadge : notificationIcon}
            style={{ width: '100%', height: '100%' }}
          />
        </NotificationIcon>
      </Header>

      <StorefrontImage onPress={handlePressProducts}>
        <Image source={imagePath} style={{ width: '100%', height: '100%' }} />
      </StorefrontImage>

      <OrderSummary onPress={handlePressOrders}>
        <OrderSummaryTextArea>
        <OrderSummaryHeading>Order Received</OrderSummaryHeading>
        <OrderSummaryText>Total no. of order: 2</OrderSummaryText>
        <OrderSummaryText>Total items sold: 5</OrderSummaryText>
        </OrderSummaryTextArea>
        <OrderAmountArea>
        <OrderAmount>₹ <SettlementAmountText>7000.00</SettlementAmountText></OrderAmount>
        </OrderAmountArea>
      </OrderSummary>

      <OrderList>
        <OrderListTitle>Order to be Picked-Up:</OrderListTitle>
        <OrderItem>
          <OrderItemText>Order Id : AW0001</OrderItemText>
          <OrderItemText>Product : Patta Chitra</OrderItemText>
          <OrderItemText>Quantity : 1</OrderItemText>
        </OrderItem>
        <OrderItem>
          <OrderItemText>Order Id : AW0002</OrderItemText>
          <OrderItemText>Product : Patta Chitra 2</OrderItemText>
          <OrderItemText>Quantity : 1</OrderItemText>
        </OrderItem>
        <OrderItem>
          <OrderItemText>Order Id : AW0002</OrderItemText>
          <OrderItemText>Product : Patta Chitra 3</OrderItemText>
          <OrderItemText>Quantity : 1</OrderItemText>
        </OrderItem>
      </OrderList>

      <Settlement>
        <SettlementText>Total Settlement Pending</SettlementText>
        <SettlementAmountArea>
        <SettlementAmount>₹ <SettlementAmountText>1500.00</SettlementAmountText></SettlementAmount>
        </SettlementAmountArea>
      </Settlement>
    </Container>
  );
};

export default HomePage;
