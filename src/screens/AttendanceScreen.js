import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import * as Location from 'expo-location';
import { useNavigation, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { getProfileInfo } from '../services/authServices';
import RemarksInput from '../components/RemarkInput';
import HeaderComponent from './HeaderComponent';
import { getEmpAttendance, postCheckIn } from '../services/productServices';
import Loader from '../components/old_components/Loader';  // Assuming you have a Loader component
import SuccessModal from '../components/SuccessModal';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

const AttendanceButton = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;

const AttendanceCard = styled.View`
  border: 1px solid #007bff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.disabled ? (props.type === 'checkin' ? '#0EAE10' : '#D12E2E') : '#ffffff'};
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  flex-direction: row;
  border: 1px solid #007bff;
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.disabled ? '#ffffff' : '#000000')};
  font-size: 12px;
`;

const CheckStatusButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
`;

const CheckStatusText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const RemarkModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const RemarkModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  /* align-items: center; */
`;

const RemarkModalButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
`;

const EmpDataContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const EmpImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: #a970ff;
  height: 60px;
  width: 60px;
  margin-right: 10px;
  border-radius: 30px;
`;

const Value = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

const AddAttendance = () => {
  

  return (
    <>
      <HeaderComponent headerTitle="My Attendance" onBackPress={() => navigation.goBack()} />
      <Container>
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <>
            <Label>Hi Atomwalk</Label>
            
          </>
        )}
      </Container>
    </>
  );
};

export default AddAttendance;