import maskFunctionTests from '../../common/maskFunctionTests.js';
import testParameters, {
  noGuideMode,
  caretTrapTests,
  acceptedCharInMask,
} from '../../common/testParameters.js';
import adjustCaretPosition from '../../core/adjustCaretPosition.js';
import { PlaceholderChar } from '../../utils/constants.js';
import { convertMaskToPlaceholder } from '../../utils/helpers.js';

describe('adjustCaretPosition', () => {
  it('places the caret at the beginning when the value has been reset programmatically', () => {
    expect(
      adjustCaretPosition({
        previousConformedValue: '',
        placeholderChar: PlaceholderChar,
        conformedValue: '________-___',
        placeholder: convertMaskToPlaceholder([
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
        ]),
        rawValue: '',
        currentCaretPosition: 3,
      }),
    ).to.equal(0);
  });

  it('places the caret after the last change when operation is addition', () => {
    expect(
      adjustCaretPosition({
        previousConformedValue: '3333',
        placeholderChar: PlaceholderChar,
        conformedValue: '2938',
        placeholder: convertMaskToPlaceholder([/\d/, /\d/, /\d/, /\d/]),
        rawValue: '2938',
        currentCaretPosition: 4,
      }),
    ).to.equal(4);
  });

  it(
    'sets the caret back in order to prevent it from moving when the change ' +
      'has not actually modified the output and the operation is not deletion',
    () => {
      expect(
        adjustCaretPosition({
          previousConformedValue: '(123) ___-____',
          conformedValue: '(123) ___-____',
          rawValue: '(123) ___-f____',
          placeholder: convertMaskToPlaceholder([
            '(',
            /\d/,
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 11,
        }),
      ).to.equal(10);
    },
  );

  it(
    'moves the caret to the nearest placeholder character if the previous input and new ' +
      'conformed output are the same but the reverted position is not a ' +
      'placeholder character',
    () => {
      expect(
        adjustCaretPosition({
          previousConformedValue: '(___)      ___-____',
          conformedValue: '(___)      ___-____',
          rawValue: '(___))      ___-____',
          placeholder: convertMaskToPlaceholder([
            '(',
            /\d/,
            /\d/,
            /\d/,
            ')',
            ' ',
            ' ',
            ' ',
            ' ',
            ' ',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 5,
        }),
      ).to.equal(11);
    },
  );

  it(
    'knows to move the caret back when the previousInput and conformToMaskResults output ' +
      'are identical but the operation is deletion',
    () => {
      expect(
        adjustCaretPosition({
          previousConformedValue: '(123) ___-____',
          conformedValue: '(123) ___-____',
          rawValue: '(123 ___-____',
          placeholder: convertMaskToPlaceholder([
            '(',
            /\d/,
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 4,
        }),
      ).to.equal(4);
    },
  );

  it(
    'knows to move caret to the next mask area when the last character of the current part ' +
      'has just been filled and the caret is at the end of the mask part',
    () => {
      expect(
        adjustCaretPosition({
          previousConformedValue: '(12_) _',
          conformedValue: '(123) _',
          rawValue: '(123_) _',
          placeholder: convertMaskToPlaceholder(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 4,
        }),
      ).to.equal(6);

      expect(
        adjustCaretPosition({
          previousConformedValue: '(12_) 7',
          conformedValue: '(132) _',
          rawValue: '(132_) 7',
          placeholder: convertMaskToPlaceholder(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 3,
        }),
      ).to.equal(3);
    },
  );

  it(
    'knows to move caret to previous mask part when the first character of current part ' +
      'has just been deleted and the caret is at the beginning of the mask part',
    () => {
      expect(
        adjustCaretPosition({
          previousConformedValue: '(124) 3',
          conformedValue: '(124) _',
          rawValue: '(124) ',
          placeholder: convertMaskToPlaceholder(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 6,
        }),
      ).to.equal(4);

      expect(
        adjustCaretPosition({
          previousConformedValue: '(12_) 3',
          conformedValue: '(12_) _',
          rawValue: '(12_) ',
          placeholder: convertMaskToPlaceholder(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/]),
          placeholderChar: PlaceholderChar,
          currentCaretPosition: 6,
        }),
      ).to.equal(4);
    },
  );
});

describe('Guide mode', () => {
  test.each(
    testParameters.filter((testParameter) => {
      return !(
        Array.isArray(testParameter.skips) && testParameter.skips.includes('adjustCaretPosition')
      );
    }),
  )(`for input: %o, it knows to adjust the caret to %i. Line: `, (input) => {
    expect(
      adjustCaretPosition({
        previousConformedValue: input.previousConformedValue,
        previousPlaceholder: input.previousPlaceholder,
        conformedValue: input.conformedValue,
        rawValue: input.rawValue,
        placeholder: convertMaskToPlaceholder(input.mask),
        placeholderChar: PlaceholderChar,
        currentCaretPosition: input.currentCaretPosition,
      }),
    ).to.equal(input.adjustedCaretPosition);
  });
});

describe('No-guide mode', () => {
  test.each(noGuideMode)(`for input: %o, it knows to adjust the caret to %i. Line: `, (input) => {
    expect(
      adjustCaretPosition({
        previousConformedValue: input.previousConformedValue,
        conformedValue: input.conformedValue,
        rawValue: input.rawValue,
        placeholder: convertMaskToPlaceholder(input.mask),
        placeholderChar: PlaceholderChar,
        currentCaretPosition: input.currentCaretPosition,
      }),
    ).to.equal(input.adjustedCaretPosition);
  });
});

describe('Mask function tests', () => {
  test.each(
    maskFunctionTests.filter(
      (testParameter) => !testParameter?.skips?.includes('adjustCaretPosition'),
    ),
  )(`for input: %o, it knows to adjust the caret to `, (input) => {
    expect(
      adjustCaretPosition({
        previousConformedValue: input.previousConformedValue,
        conformedValue: input.conformedValue,
        rawValue: input.rawValue,
        placeholder: convertMaskToPlaceholder(input.mask),
        placeholderChar: PlaceholderChar,
        currentCaretPosition: input.currentCaretPosition,
      }),
    ).to.equal(input.adjustedCaretPosition);
  });
});

describe('Caret trap tests', () => {
  test.each(caretTrapTests)(`for input: %o, it knows to adjust the caret to `, (input) => {
    expect(
      adjustCaretPosition({
        previousConformedValue: input.previousConformedValue,
        conformedValue: input.conformedValue,
        rawValue: input.rawValue,
        placeholder: convertMaskToPlaceholder(input.mask),
        placeholderChar: PlaceholderChar,
        currentCaretPosition: input.currentCaretPosition,
        caretTrapIndexes: input.caretTrapIndexes,
      }),
    ).to.equal(input.adjustedCaretPosition);
  });
});

describe('Accepted char in mask', () => {
  test.each(acceptedCharInMask)(`for input: %o, it knows to adjust the caret to `, (input) => {
    expect(
      adjustCaretPosition({
        previousConformedValue: input.previousConformedValue,
        conformedValue: input.conformedValue,
        rawValue: input.rawValue,
        placeholder: convertMaskToPlaceholder(input.mask),
        placeholderChar: PlaceholderChar,
        currentCaretPosition: input.currentCaretPosition,
        // caretTrapIndexes: input?.caretTrapIndexes,
      }),
    ).to.equal(input.adjustedCaretPosition);
  });
});
