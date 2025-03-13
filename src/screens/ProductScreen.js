import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import { getProductList } from '../services/productServices';

const Container = styled.View`
  flex: 1;
  background-color: #848598;
  padding: 15px;
`;

const SearchBar = styled.View`
  background-color: #fff;
  padding: 10px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 2;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin-left: 10px;
  color: #333;
`;

const FilterContainer = styled.View`
  background-color: #848598;
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 15px;
  elevation: 2;
`;

const DropdownContainer = styled(Dropdown)`
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  elevation: 3;
`;

const ProductGrid = styled.FlatList`
  flex: 1;
`;

const ProductCard = styled.TouchableOpacity`
  background-color: #ffffff;
  width: 48%;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 150px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ProductInfo = styled.View`
  padding: 10px;
`;

const ProductTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #ff6f61;
  margin-top: 5px;
`;

const AddButtonContainer = styled.View`
  width: 100%;
  padding: 5px 20px;
  position: absolute;
  bottom: 0;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #0043f9;
  padding: 15px;
  border-radius: 20px;
  align-items: center;
`;

const AddButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const ProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false); // State for filter visibility
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    fetchProductList();
  }, []);

  const fetchProductList = async () => {
    try {
      const res = await getProductList();
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error('Error fetching product data:', err);
    }
  };

  console.log('Product List-=--=>',products)

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterProducts(text, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (search, category) => {
    const searchText = search.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchText) ||
        product.selling_price.toString().includes(searchText);
      const matchesCategory =
        category === 'All' || product.category === category;

      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  };

  const handleProductPress = (product) => {
    router.push({
      pathname: 'ProductDetails',
      params: { product: JSON.stringify(product) },
    });
  };

  const handleAddProduct = () => {
    router.push('ProductAdd');
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const renderProduct = ({ item }) => (
    <ProductCard onPress={() => handleProductPress(item)}>
      <ProductImage source={{ uri: item.image }} />
      <ProductInfo>
        <ProductTitle>{item.product_name}</ProductTitle>
        <ProductPrice>₹ {item.selling_price}</ProductPrice>
      </ProductInfo>
    </ProductCard>
  );

  const categories = ['All', ...new Set(products.map((p) => p.category))].map(
    (category) => ({
      label: category,
      value: category,
    })
  );

  return (
    <>
      <HeaderComponent
        headerTitle="My Products"
        onBackPress={() => navigation.goBack()}
      />
      <Container>
        <SearchBar>
          <Ionicons name="search" size={20} color="#333" />
          <SearchInput
            placeholder="Search by Name or Price"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={toggleFilters}>
            <Ionicons
              name={showFilters ? 'filter' : 'filter-outline'}
              size={24}
              color="#333"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </SearchBar>
        {showFilters && (
          <FilterContainer>
            <DropdownContainer
              data={categories}
              value={selectedCategory}
              onChange={(item) => handleCategoryChange(item.value)}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10 }}
              placeholderStyle={{ color: '#aaa' }}
              selectedTextStyle={{ color: '#333', fontWeight: 'bold' }}
            />
          </FilterContainer>
        )}
        <ProductGrid
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </Container>
      <AddButtonContainer>
        <AddButton onPress={handleAddProduct}>
          <AddButtonText>Add Product</AddButtonText>
        </AddButton>
      </AddButtonContainer>
    </>
  );
};

export default ProductScreen;
