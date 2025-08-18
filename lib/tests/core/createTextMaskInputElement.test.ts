import userEvent from '@testing-library/user-event';

import createTextMaskInputElement from '../../core/createTextMaskInputElement';
import { PlaceholderChar } from '../../utils/constants';

describe('createTextMaskInputElement', () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    document.body.appendChild(inputElement);
  });

  it(
    'takes an inputElement and other Text Mask parameters and returns an object which ' +
      'allows updating and controlling the masking of the input element',
    () => {
      const maskedInputElementControl = createTextMaskInputElement({
        inputElement,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      });

      expect(maskedInputElementControl.update).to.be.a('function');
    },
  );

  it('works with mask functions', () => {
    const mask = () => [/\d/, /\d/, /\d/, /\d/];

    expect(() => createTextMaskInputElement({ inputElement, mask })).to.not.throw();
  });

  it('displays mask when showMask is true', () => {
    const textMaskControl = createTextMaskInputElement({
      showMask: true,
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    });
    textMaskControl.update();
    expect(inputElement.value).to.equal('(___) ___-____');
  });

  it('does not display mask when showMask is false', () => {
    const textMaskControl = createTextMaskInputElement({
      showMask: false,
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    });
    textMaskControl.update();
    expect(inputElement.value).to.equal('');
  });
});

describe('`update` method', () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    document.body.appendChild(inputElement);
  });

  it('conforms whatever value is in the input element to a mask', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');

    textMaskControl.update();
    expect(inputElement).toHaveValue('(2__) ___-____');
  });

  it('works after multiple calls', async () => {
    const mask = [
      '+',
      '1',
      ' ',
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
    ];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');
    textMaskControl.update();
    expect(inputElement).toHaveValue('+1 (2__) ___-____');

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '+1 (23__) ___-____');
    inputElement.selectionStart = 6;
    textMaskControl.update();
    expect(inputElement).toHaveValue('+1 (23_) ___-____');

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '+1 (2_) ___-____');
    inputElement.selectionStart = 5;
    textMaskControl.update();
    expect(inputElement).toHaveValue('+1 (2__) ___-____');

    // await userEvent.clear(inputElement);
    // await userEvent.type(inputElement, '+1 (__) ___-____');
    // inputElement.selectionStart = 4;
    // textMaskControl.update();
    // expect(inputElement).toHaveValue('');
  });

  it('accepts a string to conform and overrides whatever value is in the input element', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');
    textMaskControl.update('123');
    expect(inputElement).toHaveValue('(123) ___-____');
  });

  it('accepts an empty string and overrides whatever value is in the input element', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    textMaskControl.update(123);
    expect(inputElement.value).to.equal('(123) ___-____');

    textMaskControl.update('');
    expect(inputElement.value).to.equal('');
  });

  it('accepts an empty string after reinitializing text mask', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    let textMaskControl = createTextMaskInputElement({ inputElement, mask });

    textMaskControl.update(123);
    expect(inputElement.value).to.equal('(123) ___-____');

    //reset text mask
    textMaskControl = createTextMaskInputElement({ inputElement, mask });

    // now clear the value
    textMaskControl.update('');
    expect(inputElement.value).to.equal('');
  });

  // it('does not conform given parameter if it is the same as the previousConformedValue', async () => {
  //   const conformToMaskSpy = vi.fn(conformToMask);

  //   const conformToMaskSpy = vi.spyOn(conformToMask, '');

  //   const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  //   const textMaskControl = createTextMaskInputElement({ inputElement, mask });

  //   createTextMaskInputElement.__Rewire__('conformToMask', conformToMaskSpy);

  //   await userEvent.clear(inputElement);
  //   await userEvent.type(inputElement, '2');
  //   textMaskControl.update();

  //   expect(inputElement).toHaveValue('(2__) ___-____');
  //   expect(conformToMaskSpy).toHaveBeenCalledTimes(1);

  //   textMaskControl.update('(2__) ___-____');
  //   expect(conformToMaskSpy).toHaveBeenCalledTimes(1);

  //   // createTextMaskInputElement.__ResetDependency__('conformToMask');
  // });

  it('works with a string', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    textMaskControl.update('2');

    expect(inputElement.value).to.equal('(2__) ___-____');
  });

  it('works with a number by coercing it into a string', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    textMaskControl.update(2);

    expect(inputElement.value).to.equal('(2__) ___-____');
  });

  it('works with `undefined` and `null` by treating them as empty strings', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    textMaskControl.update(undefined);
    expect(inputElement.value).to.equal('');

    textMaskControl.update(null);
    expect(inputElement.value).to.equal('');
  });

  it('throws if given a value that it cannot work with', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    // @ts-expect-error
    expect(() => textMaskControl.update({})).to.throw();
    // @ts-expect-error
    expect(() => textMaskControl.update(() => 'howdy')).to.throw();
    // @ts-expect-error
    expect(() => textMaskControl.update([])).to.throw();
  });

  it('adjusts the caret position', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({
      inputElement,
      mask,
      placeholder: PlaceholderChar,
    });

    inputElement.focus();
    inputElement.value = '2';
    inputElement.selectionStart = 1;

    textMaskControl.update();
    expect(inputElement.selectionStart).to.equal(2);
  });

  it.skip('does not adjust the caret position if the input element is not focused', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');
    inputElement.selectionStart = 1;

    textMaskControl.update();
    expect(inputElement.selectionStart).to.equal(0);
  });

  it('calls the mask function before every update', () => {
    const maskSpy = vi.fn(() => [/\d/, /\d/, /\d/, /\d/]);
    const textMaskControl = createTextMaskInputElement({ inputElement, mask: maskSpy });

    inputElement.value = '2';
    textMaskControl.update();
    expect(inputElement.value).to.equal('2___');

    inputElement.value = '24';
    textMaskControl.update();
    expect(inputElement.value).to.equal('24__');

    expect(maskSpy).toHaveBeenCalledTimes(2);
  });

  it('can be disabled with `false` mask', () => {
    const mask = false;
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    inputElement.value = 'a';
    textMaskControl.update();
    expect(inputElement.value).to.equal('a');
  });

  it('can be disabled by returning `false` from mask function', () => {
    const mask = () => false;
    const textMaskControl = createTextMaskInputElement({ inputElement, mask });

    inputElement.value = 'a';
    textMaskControl.update();
    expect(inputElement.value).to.equal('a');
  });

  it('can pass in a config object to the update method', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({});

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');

    textMaskControl.update(inputElement.value, { inputElement, mask });
    expect(inputElement.value).to.equal('(2__) ___-____');
  });

  it('can change the mask passed to the update method', async () => {
    const textMaskControl = createTextMaskInputElement({});

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');

    textMaskControl.update(inputElement.value, {
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    });
    expect(inputElement.value).to.equal('(2__) ___-____');

    textMaskControl.update('2', {
      inputElement,
      mask: [
        '+',
        '1',
        ' ',
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
      ],
    });
    expect(inputElement.value).to.equal('+1 (2__) ___-____');
  });

  it('can change the guide passed to the update method', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({});

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');

    textMaskControl.update(inputElement.value, { inputElement, mask, guide: true });
    expect(inputElement.value).to.equal('(2__) ___-____');

    textMaskControl.update('2', { inputElement, mask, guide: false });
    expect(inputElement.value).to.equal('(2');
  });

  it('can change the placeholderChar passed to the update method', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({});

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '2');

    textMaskControl.update(inputElement.value, { inputElement, mask, placeholderChar: '_' });
    expect(inputElement.value).to.equal('(2__) ___-____');

    textMaskControl.update('2', { inputElement, mask, placeholderChar: '*' });
    expect(inputElement.value).to.equal('(2**) ***-****');
  });

  it('can change the inputElement passed to the update method', async () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const textMaskControl = createTextMaskInputElement({});

    const secondInputElement = document.createElement('input');
    document.body.appendChild(secondInputElement);

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '1');

    await userEvent.clear(secondInputElement);
    await userEvent.type(secondInputElement, '2');

    textMaskControl.update('1', { inputElement: inputElement, mask });
    expect(inputElement).toHaveValue('(1__) ___-____');

    textMaskControl.update('2', { inputElement: secondInputElement, mask });
    expect(secondInputElement).toHaveValue('(2__) ___-____');
  });

  it('can change the config passed to createTextMaskInputElement', () => {
    const config = {
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      guide: true,
      placeholderChar: '_',
    };
    const textMaskControl = createTextMaskInputElement(config);

    inputElement.value = '2';
    textMaskControl.update();
    expect(inputElement.value).to.equal('(2__) ___-____');

    // change the mask
    config.mask = [
      '+',
      '1',
      ' ',
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
    ];
    inputElement.value = '23'; // <- you have to change the value
    textMaskControl.update();
    expect(inputElement.value).to.equal('+1 (23_) ___-____');

    // change the placeholderChar
    config.placeholderChar = '*';
    inputElement.value = '4'; // <- you have to change the value
    textMaskControl.update();
    expect(inputElement.value).to.equal('+1 (4**) ***-****');

    // change the guide
    config.guide = false;
    inputElement.value = '45'; // <- you have to change the value
    textMaskControl.update();
    expect(inputElement.value).to.equal('+1 (45');
  });

  it('can override the config passed to createTextMaskInputElement', () => {
    const textMaskControl = createTextMaskInputElement({
      inputElement,
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      guide: true,
    });

    inputElement.value = '2';
    textMaskControl.update();
    expect(inputElement.value).to.equal('(2__) ___-____');

    // pass in a config to the update method
    textMaskControl.update('23', {
      inputElement,
      mask: [
        '+',
        '1',
        ' ',
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
      ],
      guide: false,
    });
    expect(inputElement.value).to.equal('+1 (23');

    // use original config again
    inputElement.value = '234'; // <- you have to change the value
    textMaskControl.update();
    expect(inputElement.value).to.equal('(234) ___-____');
  });
});
