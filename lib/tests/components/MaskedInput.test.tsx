import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaskedInput } from '../../components/MaskedInput/MaskedInput';
import { conformToMask } from '../../core'
import { TextMaskInputElementResult } from '../../types/TextMaskInputElement';
import { emailMask } from '../../addons';
import { Pipe } from '../../types/Pipe';


describe('MaskedInput', () => {

  it('does not throw when instantiated', () => {
    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />);

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toBeInTheDocument();
  })

  it('renders a single input element', () => {
    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />)

    const maskedInput = screen.getByRole('textbox');

    expect(
      maskedInput
    ).toBeInTheDocument();
  })

  it('renders correctly with an undefined value', () => {
    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />)

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('')
  })

  it('renders correctly with an initial value', () => {
    render(<MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />);

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('(123) ___-____');
  })

  it('renders mask instead of empty string when showMask is true', () => {
    render(<MaskedInput
      showMask={true}
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />)

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('(___) ___-____');
  })

  it('does not render mask instead of empty string when showMask is false', () => {
    render(<MaskedInput
      showMask={false}
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true} />)

    const maskedInput = screen.getByRole('textbox');
    expect(maskedInput).toHaveValue('');
  })

  it.skip('calls createTextMaskInputElement with the correct config', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const guide = true;
    const placeholderChar = '*';
    const keepCharPositions = true;

    render(<MaskedInput
      mask={mask}
      guide={guide}
      placeholderChar={placeholderChar}
      keepCharPositions={keepCharPositions} />)


    // const maskedInput = screen.getByRole('textbox');

    // stub the createTextMaskInputElement method
    // maskedInput.createTextMaskInputElement = (config) => {
    //   expect(typeof config).to.equal('object')
    //   expect(config.inputElement).to.equal(renderedDOMComponent)
    //   expect(config.mask).to.equal(mask)
    //   expect(config.guide).to.equal(guide)
    //   expect(config.placeholderChar).to.equal(placeholderChar)
    //   expect(config.keepCharPositions).to.equal(keepCharPositions)
    //   return {
    //     update() { }
    //   }
    // }
    // maskedInput.initTextMask()
  })

  it.skip('sets textMaskInputElement and calls textMaskInputElement.update with the correct value', () => {
    render(<MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
    />)

    // const maskedInput = screen.getByRole('textbox');

    // stub the createTextMaskInputElement method
    // maskedInput.createTextMaskInputElement = () => {
    //   return {
    //     update(value) {
    //       expect(value).to.equal('123')
    //     }
    //   }
    // }
    // maskedInput.initTextMask()
    // expect(typeof maskedInput.textMaskInputElement).to.equal('object')
  })

  it('initializes textMaskInputElement property', () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      textMaskInputElementRef={inputRef}
      guide={true} />)

    expect(typeof inputRef.current).toEqual('object')
    expect(typeof inputRef.current?.state).to.equal('object')
    expect(typeof inputRef.current?.state.previousConformedValue).to.equal('string')
    expect(typeof inputRef.current?.update).to.equal('function')
  })

  it.skip('does not render masked characters', () => {
    render(<MaskedInput
      value='abc'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}
    />)

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('');
  })

  it('does not allow masked characters', () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}
      textMaskInputElementRef={inputRef} />
    )

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('');
    inputRef.current?.update('abc');
    expect(maskedInput).toHaveValue('');
  })

  it('can be disabled by setting the mask to false', () => {
    render(<MaskedInput
      value='123abc'
      mask={false} />)

    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('123abc')
  })

  it('can call textMaskInputElement.update to update the inputElement.value', async () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} textMaskInputElementRef={inputRef} />)
    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('');

    await userEvent.clear(maskedInput);
    await userEvent.type(maskedInput, '12345');

    inputRef.current?.update()
    expect(maskedInput).toHaveValue('(123) 45_-____')
  })

  it.skip('can pass value to textMaskInputElement.update method', () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      textMaskInputElementRef={inputRef} />)
    const maskedInput = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('(123) ___-____');
    console.log(inputRef.current)
    inputRef.current?.update('1234');
    console.log(inputRef.current)
    expect(maskedInput).toHaveValue('(123) 4__-____')
  })

  it.skip('can pass textMaskConfig to textMaskInputElement.update method', () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      value='123'
      mask={false}
      textMaskInputElementRef={inputRef} />)

    const maskedInput: HTMLInputElement = screen.getByRole('textbox');

    expect(maskedInput).toHaveValue('123');

    inputRef.current?.update('1234', {
      inputElement: maskedInput,
      mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    expect(maskedInput).toHaveValue('(123) 4__-____');
  })

  it('accepts function as mask property', () => {
    render(<MaskedInput
      value='1234'
      mask={(value) => {
        expect(value).toEqual('1234')
        return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      }} />)
    const maskedInput = screen.getByRole('textbox');
    expect(maskedInput).toHaveValue('(123) 4__-____');
  })

  it('accepts object as mask property', () => {
    render(
      <MaskedInput
        value='abc'
        mask={emailMask} />
    )
    const maskedInput = screen.getByRole('textbox');
    expect(maskedInput).toHaveValue('abc@ .');
  })

  it('accepts pipe function', () => {
    render(<MaskedInput
      value='1234'
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      pipe={(value) => {
        expect(value).to.equal('(123) 4__-____')
        return 'abc'
      }} />)
    const maskedInput = screen.getByRole('textbox');
    expect(maskedInput).toHaveValue('abc');
  })

  it.skip('calls textMaskInputElement.update and props.onChange when a change event is received', async () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();
    const onChangeSpy = vi.fn((event) => {
      expect(event.target.value).toBe('123');
    });

    render(<MaskedInput
      value='123'
      onChange={onChangeSpy}
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}
      textMaskInputElementRef={inputRef} />)
    const maskedInput = screen.getByRole('textbox');

    if (inputRef.current) {
      vi.spyOn(inputRef.current, 'update');

      await userEvent.type(maskedInput, '123');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(inputRef.current?.update).toHaveBeenCalledTimes(1);
    }
  })

  it.skip('calls props.onBlur when a change event is received', async () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();
    const onBlurSpy = vi.fn((event) => {
      expect(event.target.value).toBe('(123) ___-____');
    });

    render(<MaskedInput
      value='123'
      onBlur={onBlurSpy}
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}
      textMaskInputElementRef={inputRef}
    />)

    await userEvent.tab();
    expect(onBlurSpy).toHaveBeenCalledTimes(1);
  })

  it.skip('calls textMaskInputElement.update when an input event is received when props.onChange is not set', async () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();
    render(
      <MaskedInput
        value='123'
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}
        textMaskInputElementRef={inputRef} />
    )
    const maskedInput = screen.getByRole('textbox');

    if (inputRef.current) {
      vi.spyOn(inputRef.current, 'update');

      await userEvent.type(maskedInput, '456');
      expect(inputRef.current?.update).toHaveBeenCalledTimes(1);
    }
  })

  it.skip('calls textMaskInputElement.update via onChange method', () => {
    const inputRef = createRef<TextMaskInputElementResult | null>();

    render(<MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}
      textMaskInputElementRef={inputRef} />)

    if (inputRef.current) {
      vi.spyOn(inputRef.current, 'update');
      // maskedInput?.onchange?.()
      expect(inputRef.current.update).toHaveBeenCalledTimes(1);
    }
  })

  // test fix for issues #230, #483, #778 etc.
  it.skip('works correct in stateful Component', async () => {

    const StatefulComponent: React.FC = () => {
      const [value, setValue] = useState('1234');

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      };

      return (
        <MaskedInput
          onChange={onChange}
          value={value}
          mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          guide={false}
        />
      );
    };

    render(
      <StatefulComponent />
    )

    const maskedInput = screen.getByRole('textbox');

    // Initial value "1234" from StatefulComponent is masked correct
    expect(maskedInput).toHaveValue('(123) 4')

    // Simulate deleting last char "4" from input
    // component.value = '(123'
    await userEvent.type(maskedInput, '(123');

    // Simulate onChange event with current value "(123"
    await userEvent.type(maskedInput, '(123');

    // Now we expect to see value "(123" instead of "(123) "
    expect(maskedInput).toHaveValue('(123');
  })
})

// Test for issue #806
describe('MaskedInput as controlled component', () => {

  function StatefulComponent() {
    const [value, setValue] = useState('');
    const [mask, setMask] = useState(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]);
    const [guide, setGuide] = useState<boolean | undefined>(false);
    const [placeholderChar, setPlaceholderChar] = useState('_');
    const [showMask, setShowMask] = useState(false);
    const [pipe, setPipe] = useState<Pipe | undefined>(undefined);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    }

    const onMaskArray = () => {
      setMask(['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]);
    }

    const onMaskFunction = () => {
      setMask(() => [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]);
    }

    const onGuideOn = () => {
      setGuide(true);
    }

    const onPlaceholderChar = () => {
      setPlaceholderChar('*')
    }

    const onShowMaskOn = () => {
      setGuide(undefined);
      setShowMask(true);
    }

    const onPipeOn = () => {
      setPipe((conformedValue: string) => ({ value: `Tel. ${conformedValue}`, indexesOfPipedChars: [0, 1, 2, 3, 4] }))
    }

    const onPipeOff = () => {
      setPipe(undefined)
    }

    const onPipeAnother = () => {
      setPipe((conformedValue: string) => ({ value: `Tel: ${conformedValue}`, indexesOfPipedChars: [0, 1, 2, 3, 4] }))
    }

    return (
      <div>
        <input onChange={onChange} value={value} className={'user-input'} data-testid='user-input' />
        <MaskedInput
          value={value}
          mask={mask}
          guide={guide}
          placeholderChar={placeholderChar}
          showMask={showMask}
          pipe={pipe}
          data-testid='masked-input'
          className={'masked-input'}
        />
        <button className='mask-array-button' data-testid='mask-array-button' onClick={onMaskArray}>Change mask array</button>
        <button className='mask-function-button' data-testid='mask-function-button' onClick={onMaskFunction}>Change mask function</button>
        <button className='guide-on-button' data-testid='guide-on-button' onClick={onGuideOn}>Guide On</button>
        <button className='placeholderChar-button' data-testid='placeholderChar-button' onClick={onPlaceholderChar}>
          Change placeholderChar
        </button>
        <button className='showMask-on-button' data-testid='showMask-on-button' onClick={onShowMaskOn}>ShowMask On</button>
        <button className='pipe-on-button' data-testid='pipe-on-button' onClick={onPipeOn}>Pipe On</button>
        <button className='pipe-off-button' data-testid='pipe-off-button' onClick={onPipeOff}>Pipe Off</button>
        <button className='pipe-another-button' data-testid='pipe-another-button' onClick={onPipeAnother}>Pipe Another</button>
      </div>
    )
  }

  it('works if value prop was changed', async () => {
    render(<StatefulComponent />)

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Check value changing
    await userEvent.type(renderedDOMUserInput, '123');
    expect(renderedDOMMaskedInput).toHaveValue('(123) ');

    await userEvent.clear(renderedDOMUserInput);
    await userEvent.type(renderedDOMUserInput, '12345678901234567890');
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-7890');

    await userEvent.clear(renderedDOMUserInput);
    expect(renderedDOMMaskedInput).toHaveValue('')
  })

  it('works if showMask prop was changed', async () => {
    render(<StatefulComponent />)

    // Find inputs
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonShowMaskOn = screen.getByTestId('showMask-on-button');

    // Check showMask changing
    await userEvent.click(renderedDOMButtonShowMaskOn);
    expect(renderedDOMMaskedInput).toHaveValue('(___) ___-____');
  })

  it('works if guide prop was changed', async () => {
    render(<StatefulComponent />)

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonGuideOn = screen.getByTestId('guide-on-button');

    // Check guide on changing
    await userEvent.type(renderedDOMUserInput, '(123) ');
    expect(renderedDOMMaskedInput).toHaveValue('(123) ')

    await userEvent.click(renderedDOMButtonGuideOn);
    expect(renderedDOMMaskedInput).toHaveValue('(123) ___-____')
  })

  it('works if placeholderChar prop was changed', async () => {
    render(<StatefulComponent />)

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonGuideOn = screen.getByTestId('guide-on-button');
    const renderedDOMButtonPlaceholderChar = screen.getByTestId('placeholderChar-button');

    // Check placeholderChar changing
    await userEvent.click(renderedDOMButtonGuideOn);

    await userEvent.type(renderedDOMUserInput, '(123) ___-____');
    expect(renderedDOMMaskedInput).toHaveValue('(123) ___-____')

    await userEvent.click(renderedDOMButtonPlaceholderChar);
    expect(renderedDOMMaskedInput).toHaveValue('(123) ***-****')
  })

  it('works if mask as array prop was changed', async () => {
    render(
      <StatefulComponent />
    )

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonMaskArray = screen.getByTestId('mask-array-button');

    // Check mask as array changing
    await userEvent.type(renderedDOMUserInput, '(123) 456-7890');
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-7890');

    await userEvent.click(renderedDOMButtonMaskArray);
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-78-90')
  })

  it('works if mask as function prop was changed', async () => {
    render(<StatefulComponent />);

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonMaskFunction = screen.getByTestId('mask-function-button');

    // Check mask as function changing
    await userEvent.type(renderedDOMUserInput, '(123) 456-7890');
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-7890');

    await userEvent.click(renderedDOMButtonMaskFunction);
    expect(renderedDOMMaskedInput).toHaveValue('123 456-7890');
  })

  it.skip('works if pipe prop was changed', async () => {
    render(<StatefulComponent />);

    // Find inputs
    const renderedDOMUserInput = screen.getByTestId('user-input');
    const renderedDOMMaskedInput = screen.getByTestId('masked-input');

    // Find buttons
    const renderedDOMButtonPipeOn = screen.getByTestId('pipe-on-button');
    const renderedDOMButtonPipeOff = screen.getByTestId('pipe-off-button');
    const renderedDOMButtonPipeAnother = screen.getByTestId('pipe-another-button');

    // Check pipe changing
    // `pipe` undefined to function
    await userEvent.type(renderedDOMUserInput, '(123) 456-7890');
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-7890')

    await userEvent.click(renderedDOMButtonPipeOn);
    expect(renderedDOMMaskedInput).toHaveValue('Tel. (123) 456-7890')
    // `pipe` function to another function
    await userEvent.clear(renderedDOMUserInput);
    await userEvent.type(renderedDOMUserInput, 'Tel. (123) 456-7890');
    await userEvent.click(renderedDOMButtonPipeAnother);
    expect(renderedDOMMaskedInput).toHaveValue('Tel: (123) 456-7890')
    // `pipe` function to undefined
    await userEvent.clear(renderedDOMUserInput);
    await userEvent.type(renderedDOMUserInput, 'Tel: (123) 456-7890');
    await userEvent.click(renderedDOMButtonPipeOff);
    expect(renderedDOMMaskedInput).toHaveValue('(123) 456-7890')
  })
})

describe('conformToMask', () => {
  it('is a function', () => {
    expect(typeof conformToMask).to.equal('function')
  })
})
