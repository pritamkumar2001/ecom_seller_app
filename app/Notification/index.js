import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NotificationScreen from '../../src/screens/NotificationScreen';

const index = () => {
  return (
    <View style={{ flex: 1}}>
            {/* <ApproveLeave/> */}
            <NotificationScreen/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})