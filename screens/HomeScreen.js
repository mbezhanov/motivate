import React, { Component } from 'react';
import { ImageBackground, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { loadRandomQuote, deleteCurrentQuote } from '../store/actions/quotes';
import { clearToast } from '../store/actions/ui';
import StyledText from '../components/StyledText';
import Menu from '../components/Menu';
import Quote from '../components/Quote';
import Toast from '../components/Toast';
import Sizes from '../constants/Sizes';
import LoremPicsum from '../services/LoremPicsum';

class HomeScreen extends Component {

  static navigationOptions = { header: null };

  render() {
    let quote;
    let toast;

    if (!this.props.loading) {
      quote = this.props.quote ? <Quote quote={this.props.quote} /> : <StyledText size={Sizes.XL}>Your collection is empty.</StyledText>;
    }

    if (this.props.toast) {
      toast = <Toast content={this.props.toast} transparent={true} onComplete={this.props.clearToast} />;
    }
    const imageUrl = this.props.quote ? this.props.quote.imageUrl : LoremPicsum.getDefaultImage();

    return (
      <ImageBackground source={{uri: imageUrl }}  style={{width: '100%', height: '100%'}}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this.props.loadRandomQuote}
            />
          }
        >
          {quote}
          <View style={styles.toastContainer}>
            {toast}
          </View>
          <Menu
            quote={this.props.quote}
            navigation={this.props.navigation}
            onDelete={this.props.deleteCurrentQuote}
            onSuccessfulImport={this.props.loadRandomQuote}
          />
        </ScrollView>
      </ImageBackground>
    );
  }

  componentDidMount() {
    this.props.loadRandomQuote();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContainer: {
    flex: 0,
    width: '100%',
    position: 'absolute',
    top: '55%',
  }
});

const mapStateToProps = (state) => {
  return {
    loading: state.ui.loading,
    toast: state.ui.toast,
    quote: state.quotes.selectedQuote,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadRandomQuote: () => dispatch(loadRandomQuote()),
    deleteCurrentQuote: () => dispatch(deleteCurrentQuote()),
    clearToast: () => dispatch(clearToast()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
