import React from 'react';
import { View } from 'react-native';
import StyledText from './StyledText';
import Sizes from '../constants/Sizes';
import PropTypes from 'prop-types';

const quote = ({ quote }) => {
  if (!quote) {
    return <View/>;
  }

  return (
    <View>
      <StyledText size={Sizes.XL}>{quote.content}</StyledText>
      <StyledText size={Sizes.L}>{quote.author}</StyledText>
      <StyledText size={Sizes.M}>{quote.book}</StyledText>
    </View>
  );
};

quote.propTypes = {
  quote: PropTypes.shape({
    content: PropTypes.string,
    author: PropTypes.string,
    book: PropTypes.string,
  }),
};

export default quote;
