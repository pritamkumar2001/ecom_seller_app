import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const _layout = () => {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor:"blue"}}>
    <Tabs.Screen name='home'
    options={{
     title:'Home',
     headerShown:false,
     tabBarIcon:({color})=><FontAwesome name="home" size={24} color={color} />
    }}/>
    
    <Tabs.Screen name='products'
    options={{
     title:'Products',
     headerShown:false,
     tabBarIcon:({color})=><MaterialCommunityIcons name="package" size={24} color={color}/>
    }}></Tabs.Screen> 
    <Tabs.Screen name='orders'
    options={{
     title:'Orders',
     headerShown:false,
     tabBarIcon:({color})=><MaterialCommunityIcons name="package" size={24} color={color} />
    }}></Tabs.Screen>
    <Tabs.Screen name='shipment'
    options={{
     title:'Shipment',
     headerShown:false,
     tabBarIcon:({color})=><MaterialCommunityIcons name="shipping-pallet" size={24} color={color} />
    }}></Tabs.Screen> 
    <Tabs.Screen name='profile'options={{
     title:'Profile',
     headerShown:false,
     tabBarIcon:({color})=><Ionicons name="people" size={24} color={color}/>
    }}></Tabs.Screen> 
 </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})