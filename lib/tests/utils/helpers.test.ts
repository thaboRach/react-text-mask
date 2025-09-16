import { convertMaskToPlaceholder, processCaretTraps } from '../../utils/helpers';

describe('convertMaskToPlaceholder', () => {
  it('should throw an error if mask is not an array', () => {
    const err = /mask property must be an array/i;

    expect(() => convertMaskToPlaceholder(false)).toThrow(err);
    expect(() => convertMaskToPlaceholder(true)).toThrow(err);
  });

  it('should throw an error if placeholder character is used as part of the mask', () => {
    const mask = ['$', /\d/, /\d/, /\d/, /\d/, '.', '[]', /\d/, /\d/];

    expect(() => convertMaskToPlaceholder(mask, '.')).toThrow(
      /placeholder character must not be used as part of the mask/i,
    );
  });

  it('should should convert the mask to a placeholder', () => {
    const mask = ['$', /\d/, /\d/, /\d/, /\d/, '.', '[]', /\d/, /\d/];

    expect(convertMaskToPlaceholder(mask, '_')).toBe('$____.[]__');
  });
});

describe('processCaretTraps', () => {
  it('should return the mask without caret traps and the caret trap indexes', () => {
    const mask = ['$', /\d/, /\d/, /\d/, /\d/, '.', '[]', /\d/, /\d/];
    expect(processCaretTraps(mask)).toEqual({
      maskWithoutCaretTraps: ['$', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/],
      indexes: [6],
    });

    const mask2 = ['$', /\d/, /\d/, /\d/, /\d/, '[]', '.', '[]', /\d/, /\d/];
    expect(processCaretTraps(mask2)).toEqual({
      maskWithoutCaretTraps: ['$', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/],
      indexes: [5, 6],
    });
  });

  it('should throw an error if mask is not an array', () => {
    expect(() => processCaretTraps(false)).toThrow(/mask property must be an array/i);
  });
});
