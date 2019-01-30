import React from 'react';
import renderer from 'react-test-renderer';
import Quote from '../Quote';

jest.mock('../StyledText', () => 'StyledText');

describe('Quote', () => {
  it('renders correctly', () => {
    const quote = {
      content: 'foo',
      author: 'bar',
      book: 'baz',
    };
    const tree = renderer.create(<Quote quote={quote} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders an empty View if no "quote" property is specified', () => {
    const tree = renderer.create(<Quote />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
