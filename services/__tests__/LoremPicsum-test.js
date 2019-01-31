import LoremPicsum from '../LoremPicsum';

describe('LoremPicsum service', () => {
  it('defaults to a random image', () => {
    expect(LoremPicsum.getDefaultImage()).toBe('https://picsum.photos/480/960/?random');
  });

  it('generates random image URLs', () => {
    const quote = 'lorem ipsum dolor';
    expect(LoremPicsum.getRandomImage(quote)).toBe('https://picsum.photos/480/960?image=788')
  })
});
