import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import ProductScreen from '../../src/screens/ProductScreen';


const index = () => {

  const route = useRoute();
  const leave = route.params;
  return (
    <View style={{ flex: 1,
        
        }}>
            {/* <LeaveScreen/> */}
            <ProductScreen/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})