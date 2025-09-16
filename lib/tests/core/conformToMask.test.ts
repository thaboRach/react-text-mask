import keepCharPositionsTests from '../../common/keepCharPositionsTests.js';
import maskFunctionTests from '../../common/maskFunctionTests.js';
import testParameters, {
  noGuideMode,
  acceptedCharInMask,
  escapedMaskChar,
} from '../../common/testParameters.js';
import { conformToMask } from '../../core/index.js';
import { PlaceholderChar } from '../../utils/constants.js';
import { convertMaskToPlaceholder } from '../../utils/helpers.js';

describe('conformToMask', () => {
  it('throws if mask is not an array or function (conformToMask)', () => {
    const error = /mask property must be an array/i;
    expect(() => conformToMask('', false, {})).toThrow(error);
    expect(() => conformToMask('', true, {})).toThrow(error);
  });
});

describe('Accepted character in mask', () => {
  test.each(acceptedCharInMask)(`for input %o, it outputs '' Line: `, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        guide: true,
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});

describe('Guide mode tests', () => {
  test.each(testParameters)(`for input %o, it outputs '' Line: `, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});

describe('No guide mode', () => {
  test.each(noGuideMode)(`for input %o, it outputs ''`, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        guide: false,
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});

describe('Allow escaped masking character in mask', () => {
  test.each(escapedMaskChar)(`for input &o, it outputs ''`, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        guide: true,
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});

describe('keepCharPositionsTests', () => {
  test.each(keepCharPositionsTests)(`for input %o, it outputs '' Line:`, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        guide: true,
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        keepCharPositions: true,
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});

describe('Mask function', () => {
  it('works with mask functions', () => {
    const mask = () => [/\d/, /\d/, /\d/, /\d/];

    expect(() => conformToMask('', mask, {})).not.toThrow();
  });

  it('calls the mask function', () => {
    const maskSpy = vi.fn(() => [/\d/, /\d/, /\d/, /\d/]);
    const result = conformToMask('2', maskSpy, {});

    expect(result.conformedValue).toBe('2___');
    expect(maskSpy).toHaveBeenCalledOnce();
  });

  it('passes the rawValue to the mask function', () => {
    const mask = (value: any) => {
      expect(typeof value).to.equal('string');
      expect(value).to.equal('2');
      return [/\d/, /\d/, /\d/, /\d/];
    };
    const result = conformToMask('2', mask, {});

    expect(result.conformedValue).toBe('2___');
  });

  it('passes the config to the mask function', () => {
    const mask = (_value: any, config: any) => {
      expect(typeof config).to.equal('object');
      expect(config).to.deep.equal({
        currentCaretPosition: 2,
        previousConformedValue: '1',
        placeholderChar: '_',
      });
      return [/\d/, /\d/, /\d/, /\d/];
    };
    const result = conformToMask('12', mask, {
      currentCaretPosition: 2,
      previousConformedValue: '1',
      placeholderChar: '_',
    });

    expect(result.conformedValue).toBe('12__');
  });

  it('processes the result of the mask function and removes caretTraps', () => {
    const mask = () => [/\d/, /\d/, '[]', '.', '[]', /\d/, /\d/];
    const result = conformToMask('2', mask, {});

    expect(result.conformedValue).to.equal('2_.__');
  });

  test.each(maskFunctionTests)(`for input %o, it outputs '' Line: `, (input) => {
    expect(
      conformToMask(input.rawValue, input.mask, {
        guide: true,
        previousConformedValue: input.previousConformedValue,
        placeholder: convertMaskToPlaceholder(input.mask, PlaceholderChar),
        currentCaretPosition: input.currentCaretPosition,
      }).conformedValue,
    ).toEqual(input.conformedValue);
  });
});
