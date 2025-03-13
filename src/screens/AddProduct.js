import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import styled from "styled-components/native";
import { colors } from '../Styles/appStyle';
import { useNavigation, useRouter } from "expo-router";
import HeaderComponent from "../components/HeaderComponent";
import Input from "../components/old_components/Input";
import FilePicker from "../components/FilePicker";
import DropdownPicker from "../components/DropdownPicker";
import { getProductCategoryInfo } from "../services/authServices";
import { postProduct } from "../services/productServices";

const Container = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Form = styled(View)`
  flex: 1;
`;

const Label = styled(Text)`
  font-size: 16px;
  margin-bottom: 5px;
  color: ${colors.grey};
`;

const TextArea = styled(TextInput)`
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 5px;
  text-align-vertical: top;
`;

const SubmitButton = styled(TouchableOpacity)`
  height: 50px;
  background-color: #00bcd4;
  border-radius: 25px;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 30px;
  align-items: center;
`;

const SubmitButtonText = styled(Text)`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [files, setFiles] = useState([]);
  const [productType, setProductType] = useState(null);
  const [isMultipleVariation, setIsMultipleVariation] = useState(false);
  const [numberOfVariations, setNumberOfVariations] = useState("");
  const [variations, setVariations] = useState([]);
  const [errors, setErrors] = useState({});
  const [productCode, setProductCode] = useState("");

  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    fetchProductCategory();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddVariations = () => {
    const num = parseInt(numberOfVariations, 10);
    if (!num || num <= 0) return;
    setVariations(
      Array.from({ length: num }, () => ({
        name: "",
        product_variations: [{ additional_price: "", value: "", images: [] }],
      }))
    );
    
  };


  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const handleProductVariationChange = (varIndex, pvIndex, field, value) => {
    console.log(`Updating Variation: ${varIndex}, Product Variation: ${pvIndex}, Field: ${field}, Value: ${value}`);
    
    setVariations((prevVariations) => {
      return prevVariations.map((variation, vIndex) => {
        if (vIndex === varIndex) {
          return {
            ...variation,
            product_variations: variation.product_variations.map((pv, pIndex) => 
              pIndex === pvIndex ? { ...pv, [field]: value } : pv
            ),
          };
        }
        return variation;
      });
    });
  };
  
  

  const handleAddProductVariation = (varIndex) => {
    setVariations((prevVariations) => {
      const updatedVariations = [...prevVariations];
      if (!updatedVariations[varIndex].product_variations) {
        updatedVariations[varIndex].product_variations = [];
      }
      updatedVariations[varIndex].product_variations.push({ additional_price: "", value: "", images: [] });
      return updatedVariations;
    });
  };
  
  

  // const handleSubmit = async () => {
  //   if (!productName || !description || !price || !selectedCategory) {
  //     Alert.alert('Error', 'Please fill all fields, select a category, and attach at least one product image.');
  //     return;
  //   }
  
  //   if (!isMultipleVariation && !quantity) {
  //     Alert.alert('Error', 'Please enter quantity available.');
  //     return;
  //   }
  
  //   if (files.length > 5) {
  //     Alert.alert('Limit Exceeded', 'You can select a maximum of 5 files.');
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   files.forEach((file, index) => {
  //     formData.append(`files[]`, {
  //       uri: file.uri,
  //       name: file.name,
  //       type: file.mimeType,
  //     });
  //   });
  
  //   formData.append('call_mode', 'ADD');
  //   formData.append('product_name', productName);
  //   formData.append('product_code', productCode);
  //   formData.append('description', description);
  //   formData.append('category_id', selectedCategory);
  //   formData.append('selling_price', price);
  //   formData.append('is_multiple_variation', isMultipleVariation);
  //   formData.append('product_type', productType);
  
  //   if (!isMultipleVariation) {
  //     formData.append('quantity', quantity);
  //   }
  
  //   const formattedVariations = variations.map(variation => ({
  //     name: variation.name,
  //     product_variations: variation.product_variations.map(pv => ({
  //       additional_price: pv.additional_price,
  //       value: pv.value,
  //       images: pv.images.slice(0, 5),
  //     })),
  //   }));
  
  //   formData.append('variations', JSON.stringify(formattedVariations));

  //   for (let pair of formData.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }
  
  //   try {
  //     const res = await postProduct(formData);
  //     if (res.status === 200 || res.status === 201) {
  //       Alert.alert('Success', 'Product added successfully.');
  //       router.push('/products'); // Make sure this is the correct route
  //     } else {
  //       console.error('Unexpected response:', res);
  //       Alert.alert('Submission Error', 'Failed to add product. Unexpected response.');
  //     }
  //   } catch (error) {
  //     console.error('Submission Failed:', error);
  //     Alert.alert('Submission Failed', `Failed to add product: ${error.message}`);
  //   }
  // };
  
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  if (isLoading) return; // Prevent duplicate submissions
  setIsLoading(true);

  // Basic validation
  if (!productName || !description || !price || !selectedCategory) {
    Alert.alert("Error", "Please fill in all required fields.");
    setIsLoading(false);
    return;
  }

  if (!isMultipleVariation && !quantity) {
    Alert.alert("Error", "Please enter the available quantity.");
    setIsLoading(false);
    return;
  }

  const productPayload = {
    product_code: productCode || "",
    product_name: productName,
    description,
    category_id: selectedCategory,
    selling_price: price,
    is_multiple_variation: isMultipleVariation,
    product_type: productType,
    call_mode: "ADD",
    quantity: isMultipleVariation ? null : quantity,
    variations: JSON.stringify(
      variations.map((variation) => ({
        name: variation.name,
        product_variations: variation.product_variations.map((pv) => ({
          additional_price: pv.additional_price,
          value: pv.value,
          images: pv.images.slice(0, 5),
        })),
      }))
    ),
  };

  console.log("Payload--->",productPayload.variations)

  // try {
  //   const res = await postProduct(productPayload);

  //   if (res.status === 200 || res.status === 201) {
  //     Alert.alert("Success", "Product added successfully.");
  //     router.push("/products"); // Ensure this route exists
  //   } else {
  //     console.error("Unexpected response:", res);
  //     Alert.alert("Submission Error", "Failed to add product. Unexpected response.");
  //   }
  // } catch (error) {
  //   console.error("Submission Failed:", error);
  //   Alert.alert("Submission Failed", `Failed to add product: ${error.message}`);
  // } finally {
  //   setIsLoading(false);
  // }
};

  

  const handleFilesChange = (newFiles) => {
    const combinedFiles = [...files, ...newFiles];
    const uniqueFiles = combinedFiles.reduce((acc, current) => {
      const exists = acc.find(file => file.uri === current.uri);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    if (uniqueFiles.length > 5) {
      Alert.alert('Limit Exceeded', 'You can select a maximum of 5 unique images.');
    } else {
      setFiles(uniqueFiles);
    }
  };

  const fetchProductCategory = async () => {
    try {
      const response = await getProductCategoryInfo();
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  

  // console.log('Category', category);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent headerTitle="Add Product" onBackPress={handleBackPress} />
      <Container>
        <Form>

        <Input
          label="Product Code (Optional):"
          value={productCode}
          onChangeText={setProductCode}
          placeholder="Enter product code (if any)"
        />

          <Input
            label="Product Name:"
            value={productName}
            onChangeText={setProductName}
            placeholder="Enter product name"
            error={errors.pname}
          />

          <Input
            label="Quantity Available:"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            keyboardType="numeric"
            error={errors.qty}
          />

          <Label>Description:</Label>
          <TextArea
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
          />

          <Input
            label="Selling Price (in INR):"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter amount for each item"
            keyboardType="numeric"
            error={errors.price}
          />

          <DropdownPicker
            label="Category"
            data={category.map(cat => ({ label: cat.name, value: cat.id }))}
            value={selectedCategory}
            setValue={setSelectedCategory}
            error={errors.category}
          />

          <DropdownPicker label="Is Multiple Variation Available?" data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} value={isMultipleVariation} setValue={setIsMultipleVariation} />
          {isMultipleVariation && <Input label="Number of Variations Type:" value={numberOfVariations} onChangeText={setNumberOfVariations} placeholder="Enter number of variations type" keyboardType="numeric" onBlur={handleAddVariations} />}
          {variations.map((variation, varIndex) => (
          <View key={varIndex} style={{ marginBottom: 10 }}>
            <Input
              label="Variation Name:"
              value={variation.name}
              onChangeText={(text) => handleVariationChange(varIndex, 'name', text)}
            />
            
            {variation.product_variations.map((pv, pvIndex) => (
              <View key={pvIndex} style={{ marginLeft: 10 }}>
                <Input
                  label={`Variation Value ${pvIndex + 1}`}
                  value={pv.value}
                  onChangeText={(text) => handleProductVariationChange(varIndex, pvIndex, 'value', text)}
                />
                
                <Input
                  label="Additional Price:"
                  value={pv.additional_price}
                  onChangeText={(text) => handleProductVariationChange(varIndex, pvIndex, 'additional_price', text)}
                  keyboardType="numeric"
                />

                <TouchableOpacity onPress={() => handleAddProductVariation(varIndex)}>
                  <Text>Add More Variations</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}


          <DropdownPicker
            label="Product Type"
            data={[{ label: 'Order to Build', value: 'Order to Build' }, { label: 'Ready to Ship', value: 'Ready to Ship' }]}
            value={productType}
            setValue={setProductType}
          />

          <FilePicker 
            label="Attach Product Images:" 
            files={files} 
            setFiles={handleFilesChange} 
            removeFile={handleRemoveFile} 
            error={errors.file} 
          />


          <SubmitButton onPress={handleSubmit}> 
            <SubmitButtonText>Send Request</SubmitButtonText>
          </SubmitButton>
        </Form>
      </Container>
    </SafeAreaView>
  );
};

export default AddProduct;