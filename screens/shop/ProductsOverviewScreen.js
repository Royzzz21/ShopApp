import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/product';
import Colors from '../../constants/Color';


const ProductOverviewScreen = props =>{
    const [isLoading, setIsLoading] = useState(false);
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            await dispatch(productActions.fetchProducts());
            setIsLoading(false);
        };
        loadProducts();
    }, [dispatch]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', { 
            productId: id,
            productTitle: title
        });
    };

    if (isLoading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
        );
    }

return (
    <FlatList 
        data={products} 
        keyExtractor={item => item.id} 
        renderItem={itemData => (
            <ProductItem 
                image={itemData.item.imageUrl} 
                title={itemData.item.title} 
                price={itemData.item.price} 
                onSelect={ () => { 
                    selectItemHandler(itemData.item.id, itemData.item.title);
                }} 
            >
                <Button
                    color={Colors.primary}
                    title="View Details"
                    onPress={ () => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                />
                <Button 
                    color={Colors.primary}
                    title="To Cart"
                    onPress={ () => {
                        dispatch(cartActions.addToCart(itemData.item));
                    }}
                />
            </ProductItem>
        )}
    />
    );
}

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Proudcts',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title="Menu" 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
             ),
        headerRight: (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
                title="Cart" 
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                    navData.navigation.navigate('Cart')
                }}
            />
        </HeaderButtons>
         )
    };

};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductOverviewScreen;

