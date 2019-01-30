import React from 'react';
import renderer from 'react-test-renderer';
import StyledText from '../StyledText';

describe('StyledText', () => {
  it('renders correctly', () => {
    const styledText = renderer.create(<StyledText>Test 123</StyledText>).toJSON();
    expect(styledText).toMatchSnapshot();
  });

  it('renders text with a custom font size', () => {
    const props = { size: 123 };
    const styledText = renderer.create(<StyledText {...props}>Test 123</StyledText>).toJSON();
    expect(styledText).toMatchSnapshot();
  });

  it('accepts custom styling', () => {
    const style = {
      marginHorizontal: 123,
      marginVertical: 456,
    };
    const props = { style };
    const styledText = renderer.create(<StyledText {...props}>Test 123</StyledText>).toJSON();
    expect(styledText).toMatchSnapshot();
  });
});
