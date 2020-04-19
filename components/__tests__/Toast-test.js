import React from 'react';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import Toast from '../Toast';

jest.mock('react-native/Libraries/Animated/src/Animated', () => {
  const ActualAnimated = jest.requireActual('react-native/Libraries/Animated/src/Animated');
  return {
    ...ActualAnimated,
    timing: (value, config) => {
      return {
        start: (callback) => {
          value.setValue(config.toValue);
          callback && callback();
        },
      };
    },
  };
});

describe('Toast', () => {
  let onComplete;
  let tree;

  beforeEach(() => {
    jest.useFakeTimers();
    onComplete = jest.fn();
    tree = renderer.create(<Toast content="foo" onComplete={onComplete} />);
  });

  it('renders correctly with opaque background', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with transparent background', () => {
    const a = tree.toJSON();
    const b = renderer.create(<Toast content="foo" onComplete={onComplete} transparent={true} />).toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('fades in gradually and then fades out', () => {
    // test fade-in:
    expect(tree.getInstance().fadeOutTimeout).toBeDefined();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls.length).toBe(0);
    expect(tree.getInstance().state.opacity._value).toBe(1);

    // test fade-out:
    jest.runAllTimers();
    expect(onComplete.mock.calls.length).toBe(1);
    expect(tree.getInstance().state.opacity._value).toBe(0);
  });

  it('frees up allocated memory before unmounting', () => {
    tree.getInstance().componentWillUnmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenCalledWith(tree.getInstance().fadeOutTimeout);
  });
});
