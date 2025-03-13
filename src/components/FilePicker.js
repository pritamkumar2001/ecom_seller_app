import React from 'react';
import { TouchableOpacity, Text, Alert, View } from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../Styles/appStyle';

const FileButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const InputText = styled.Text`
  color: black;
  font-size: 16px;
  font-weight: normal;
`;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

const FileNameText = styled.Text`
  margin-top: 5px;
  font-size: 14px;
  color: #333;
`;

const RemoveButton = styled.TouchableOpacity`
  margin-left: 10px;
  background-color: ${colors.red};
  padding: 5px 10px;
  border-radius: 5px;
`;

const RemoveButtonText = styled.Text`
  color: white;
  font-size: 12px;
`;

const FilePicker = ({ label, files = [], setFiles, removeFile, error }) => {
  const handleFilePick = async () => {
    try {
      Alert.alert(
        'Select Option',
        'Choose files from the library or capture photos',
        [
          {
            text: 'Choose Files',
            onPress: async () => {
              try {
                let result = await DocumentPicker.getDocumentAsync({
                  type: ['image/*', 'application/pdf'],
                  copyToCacheDirectory: true,
                  multiple: true,
                });
  
                if (result.type !== 'cancel' && result.assets) {
                  const selectedFiles = result.assets.map(file => ({
                    name: file.name,
                    uri: file.uri,
                    mimeType: file.mimeType || file.type || 'application/octet-stream',
                  }));
  
                  // Prevent duplicates based on URI
                  const uniqueFiles = [
                    ...files,
                    ...selectedFiles.filter(
                      (newFile) => !files.some((existingFile) => existingFile.uri === newFile.uri)
                    ),
                  ];
  
                  if (uniqueFiles.length > 5) {
                    Alert.alert('Limit Exceeded', 'You can select a maximum of 5 unique images/files.');
                    return;
                  }
  
                  setFiles(uniqueFiles);
                }
              } catch (error) {
                console.error('Error while picking files:', error);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (err) {
      Alert.alert('No File Selected', 'You have not selected any files. Please select files.');
    }
  };
  


  return (
    <>
      <Label>{label}</Label>
      <FileButton onPress={handleFilePick}>
        <InputText>{files.length > 0 ? `${files.length} files selected` : 'No files selected'}</InputText>
        <Icon source={require('../../assets/images/Upload-Icon.png')} />
      </FileButton>
      {files.length > 0 && (
        <View>
          {files.map((file, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <FileNameText>{file.name}</FileNameText>
              <RemoveButton onPress={() => removeFile(index)}> 
                <RemoveButtonText>Remove</RemoveButtonText>
              </RemoveButton>
            </View>
          ))}
        </View>
      )}
      {error && (
        <Text style={{ marginTop: 7, color: colors.red, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </>
  );
};

export default FilePicker;