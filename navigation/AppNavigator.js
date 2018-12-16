import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AddQuoteScreen from '../screens/AddQuoteScreen';

export default createAppContainer(
  createStackNavigator({
    Home: HomeScreen,
    AddQuote: AddQuoteScreen,
  })
);
