import React from 'react';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import StyledInput from '../StyledInput';
import { TextInput } from 'react-native';

const _focus = (component) => {
  const textInput = component.findByType(TextInput);
  textInput.props.onFocus();
};

const _blur = (component) => {
  const textInput = component.findByType(TextInput);
  textInput.props.onBlur();
};

describe('StyledInput', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(<StyledInput />);
  });

  it('renders correctly', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('starts having a highlight effect when focused', () => {
    const a = tree.toJSON();
    _focus(tree.root);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('stops having a highlight effect when unfocused', () => {
    _focus(tree.root);
    const a = tree.toJSON();
    _blur(tree.root);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });
});
