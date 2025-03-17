import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import ShipmentScreen from '../../src/screens/ShipmentScreen';


const index = () => {

  const route = useRoute();
  const leave = route.params;
  // const emp_data_id = leave.id
  return (
    <View style={{ flex: 1,}}>
      <ShipmentScreen/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})