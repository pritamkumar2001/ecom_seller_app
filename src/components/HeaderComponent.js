import React from 'react';
import { Text, Image, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

const HeaderContainer = styled.View`
  background-color: white;
  padding: ${height < 700 ? '10px 8px' : '15px 10px'};
  margin-top: ${height < 806 ? '20px' : '48px'};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  elevation: 2;
  width: 100%;
  min-height: ${height < 700 ? '50px' : '60px'};
`;

// Styled text for the header title
const HeaderText = styled.Text`
  font-size: ${width < 360 ? '18px' : '20px'};
  font-weight: bold;
`;

// Styled container for the back button
const BackButton = styled.TouchableOpacity`
  padding: 5px;
`;

// Path to the local back icon
const BackIcon = require('../../assets/images/back_icon.png');

const HeaderComponent = ({ headerTitle, onBackPress }) => {
  return (
    <HeaderContainer>
      <HeaderText>{headerTitle}</HeaderText>
      <BackButton onPress={onBackPress}>
        <Image source={BackIcon} style={{ width: 24, height: 24 }} />
      </BackButton>
    </HeaderContainer>
  );
};

export default HeaderComponent;
