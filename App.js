import React from 'react';
import { Image } from 'react-native';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import LoremPicsum from './services/LoremPicsum';
import configureStore from './store/configureStore';

const store = configureStore();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }

  _loadResourcesAsync = async () => {
    await Promise.all([Image.prefetch(LoremPicsum.getDefaultImage())]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
