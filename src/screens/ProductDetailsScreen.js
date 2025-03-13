import React, { useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, Dimensions } from 'react-native';
import Loader from '../components/old_components/Loader';
import { getProductDetails } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;

const ProductImage = styled.Image`
  width: ${SCREEN_WIDTH}px;
  height: 100%;
`;

const Pagination = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? '#e68a00' : '#ccc')};
  margin: 0 5px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-bottom: 10px;
`;

const Price = styled.Text`
  font-size: 22px;
  color: #e68a00;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.View`
  margin-bottom: 20px;
  padding: 0px 6px 0px 6px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SectionContent = styled.Text`
  font-size: 16px;
  color: #666;
  line-height: 22px;
`;

const VariationContainer = styled.View`
  margin-bottom: 15px;
`;

const VariationOption = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${(props) => (props.selected ? '#e68a00' : '#ddd')};
  border-radius: 5px;
  margin-right: 10px;
`;

const VariationText = styled.Text`
  color: #fff;
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
  padding: 0px 10px 0px 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.bgColor || '#e68a00'};
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const ProductDetailsScreen = ({ product_data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});
  const navigation = useNavigation();

  const parsedProduct = typeof product_data === 'string' ? JSON.parse(product_data) : product_data;
  const productId = parsedProduct?.id;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const res = await getProductDetails(productId);
      setProduct(res.data);
    } catch (err) {
      console.error('Error fetching product data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleVariationSelect = (variationName, option) => {
    setSelectedVariations((prev) => ({ ...prev, [variationName]: option }));
  };

  const getSelectedVariationDetails = () => {
    const selectedOptions = Object.values(selectedVariations);
    if (selectedOptions.length === 0) return product;

    const selectedVariation = selectedOptions[selectedOptions.length - 1];
    return selectedVariation;
  };

  const selectedDetails = getSelectedVariationDetails();

  console.log("Prd dtls==",product)

  return (
    <>
      <Loader visible={loading} />

      {!loading && (
        <>
          <HeaderComponent headerTitle="My Products" onBackPress={() => navigation.goBack()} />
          <Container>
            <ProductImageContainer>
              <FlatList
                data={selectedDetails.c_images || [selectedDetails.image]}
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <ProductImage source={{ uri: item }} resizeMode="contain" />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <Pagination>
                {(selectedDetails.c_images || [selectedDetails.image]).map((_, index) => (
                  <Dot key={index} active={index === activeIndex} />
                ))}
              </Pagination>
            </ProductImageContainer>

            <Title>{product.product_name}</Title>
            <Price>₹ {selectedDetails.selling_price}</Price>

            {product.variations && product.variations.length > 0 && (
              product.variations.map((variation) => (
                <VariationContainer key={variation.id}>
                  <SectionTitle>{variation.name}:</SectionTitle>
                  <Row>
                    {variation.product_variations.map((option) => (
                      <VariationOption
                        key={option.id}
                        selected={selectedVariations[variation.name]?.id === option.id}
                        onPress={() => handleVariationSelect(variation.name, option)}
                      >
                        <VariationText>{option.value}</VariationText>
                      </VariationOption>
                    ))}
                  </Row>
                </VariationContainer>
              ))
            )}

           
            <Section>
            <SectionTitle>Description:</SectionTitle>
            <SectionContent>{product.description}</SectionContent>
          </Section>

          {/* Additional Details */}
          <Section>
            <SectionTitle>Category:</SectionTitle>
            <SectionContent>{product.category}</SectionContent>
          </Section>

          <Section>
            <SectionTitle>Product Code:</SectionTitle>
            <SectionContent>{product.product_code}</SectionContent>
          </Section>

         

          <Section>
            <SectionTitle>Available Quantity:</SectionTitle>
            <SectionContent>{product.available_qty} {product.base_unit}</SectionContent>
          </Section>

          {/* Buttons */}
          <ButtonContainer>
            <Button bgColor="#e68a00">
              <ButtonText>Update Product</ButtonText>
            </Button>
            <Button bgColor="#e63946">
              <ButtonText>Update Pricing Request</ButtonText>
            </Button>
          </ButtonContainer>
          </Container>
        </>
      )}
    </>
  );
};

export default ProductDetailsScreen;
