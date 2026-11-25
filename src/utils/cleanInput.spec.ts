import { cleanInput } from './cleanInput';

describe('clean iput', () => {
  it('should remove special characters', () => {
    expect(cleanInput('$a')).toBe('a');
    expect(cleanInput('?a')).toBe('a');
  });
  it('should remove dots', () => {
    expect(cleanInput('jo.silva')).toBe('josilva');
  });
  it('should keep underscores', () => {
    expect(cleanInput('jo_silva')).toBe('jo_silva');
    expect(cleanInput('$jo_silva?')).toBe('jo_silva');
  });
  it('should keep underscores on arrays and objects', () => {
    expect(cleanInput(['a_b'])).toStrictEqual(['a_b']);
    expect(cleanInput({ test: 'a_b' })).toStrictEqual({ test: 'a_b' });
  });
  it('should remove special characters on arrays', () => {
    expect(cleanInput(['$a'])).toStrictEqual(['a']);
    expect(cleanInput(['?a', 'b', '$c'])).toStrictEqual(['a', 'b', 'c']);
  });
  it('should remove special characters on objects', () => {
    expect(cleanInput({ test: '$a' })).toStrictEqual({ test: 'a' });
    expect(cleanInput({ test: '?a', test2: 'b', test3: '$c' })).toStrictEqual({
      test: 'a',
      test2: 'b',
      test3: 'c',
    });
  });
  it('should return non string as is', () => {
    expect(cleanInput(5)).toBe(5);
    expect(cleanInput(null)).toBe(null);
  });
});
