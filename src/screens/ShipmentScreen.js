import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';

const ShipmentScreen = () => {
      const navigation = useNavigation();
      const router = useRouter();
  return (
    <View>
        <HeaderComponent
                headerTitle="ShipmentScreen"
                onBackPress={() => navigation.goBack()}
              />
      <Text>ShipmentScreen</Text>
    </View>
  )
}

export default ShipmentScreen