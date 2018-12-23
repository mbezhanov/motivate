import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import FormScreen from '../screens/FormScreen';

export default createAppContainer(
  createStackNavigator({
    Home: HomeScreen,
    Form: FormScreen,
  })
);
