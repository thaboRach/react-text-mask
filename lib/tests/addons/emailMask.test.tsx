import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaskedInput } from '../../components/MaskedInput/MaskedInput.js';
import { emailMask } from '../../addons/index.js';

async function input(inputElement: HTMLInputElement, rawValue: string, currentCaretPosition: number) {
  await userEvent.clear(inputElement);
  await userEvent.type(inputElement, rawValue);

  inputElement.focus();
  inputElement.setSelectionRange(currentCaretPosition, currentCaretPosition);
}

function expectResults(inputElement: HTMLInputElement, conformedValue: string, adjustedCaretPosition: number) {
  expect(inputElement).toHaveValue(conformedValue);
  expect(inputElement.selectionStart).to.equal(adjustedCaretPosition);
}


describe.skip('emailMask', () => {

  it('masks initial input as follows `a@ .`', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await userEvent.clear(maskedInput);
    await userEvent.type(maskedInput, 'a');

    maskedInput.focus();
    maskedInput.setSelectionRange(1, 1);

    expectResults(maskedInput, 'a@ .', 1)
  })

  it('allows a dot at the end of the local part', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />);
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a.', 2);
    expectResults(maskedInput, 'a.@ .', 2);
  })

  it('moves the caret to after the @ symbol when user enters an @ symbol where the current @ symbol is', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput: HTMLInputElement = screen.getByRole('textbox');

    await input(maskedInput, 'a@@', 2)
    expectResults(maskedInput, 'a@.', 2)
  })

  it('moves the caret to after the TLD dot when user enters a dot where the current TLD dot is', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a@a.com', 7)
    expectResults(maskedInput, 'a@a.com', 7)

    await input(maskedInput, 'a@a..com', 4)
    expectResults(maskedInput, 'a@a.com', 4)
  })

  it('limits the number of @ symbols in input to 1', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput: HTMLInputElement = screen.getByRole('textbox');

    await input(maskedInput, 'a@a.com', 7);
    expectResults(maskedInput, 'a@a.com', 7);
    await input(maskedInput, '@a@a.com', 1);
    expectResults(maskedInput, '@aa.com', 1);

    await input(maskedInput, 'a@a.com', 7);
    expectResults(maskedInput, 'a@a.com', 7);
    await input(maskedInput, 'a@a@.com', 4);
    expectResults(maskedInput, 'a@a.com', 3);

    await input(maskedInput, 'a@a.com', 7);
    expectResults(maskedInput, 'a@a.com', 7);
    await input(maskedInput, 'a@a.co@m', 7);
    expectResults(maskedInput, 'a@a.com', 6);
  })

  it('does not add a placeholder in the end when user types a dot after the TLD dot when there is no TLD', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a@a.', 4)
    expectResults(maskedInput, 'a@a.', 4)

    await input(maskedInput, 'a@a..', 5)
    expectResults(maskedInput, 'a@a.', 4)
  })

  it('removes the dot in the end if the domain part already contains a dot', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a@acom.', 7)
    expectResults(maskedInput, 'a@acom.', 7)

    await input(maskedInput, 'a@a.com.', 4)
    expectResults(maskedInput, 'a@a.com', 4)
  })

  it('prevents two consecutive dots', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a@a.a.com', 9)
    expectResults(maskedInput, 'a@a.a.com', 9)

    await input(maskedInput, 'a@a..a.com', 5)
    expectResults(maskedInput, 'a@a.a.com', 4)
  })

  it('just moves the caret over when user enters a dot before the TLD dot', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a@a.com', 7)
    expectResults(maskedInput, 'a@a.com', 7)

    await input(maskedInput, 'a@a..com', 4)
    expectResults(maskedInput, 'a@a.com', 4)
  })

  it('works as expected', async () => {
    render(<MaskedInput type="tel" mask={emailMask.mask} />)
    const maskedInput = screen.getByRole('textbox') as HTMLInputElement;

    await input(maskedInput, 'a', 1);
    expectResults(maskedInput, 'a@ .', 1);

    await input(maskedInput, '@ .', 0);
    expectResults(maskedInput, '', 0);

    await input(maskedInput, 'a', 1);
    expectResults(maskedInput, 'a@ .', 1);

    await input(maskedInput, 'a@@ .', 2);
    expectResults(maskedInput, 'a@.', 2);

    await input(maskedInput, 'a@f_.', 3);
    expectResults(maskedInput, 'a@f.', 3);

    await input(maskedInput, 'af.', 1);
    expectResults(maskedInput, 'a@f.', 1);

    await input(maskedInput, 'a.@f.', 2);
    expectResults(maskedInput, 'a.@f.', 2);

    await input(maskedInput, 'm', 1);
    expectResults(maskedInput, 'm@ .', 1);

    await input(maskedInput, 'm@k .', 3);
    expectResults(maskedInput, 'm@k.', 3);

    await input(maskedInput, 'm@.k.', 3);
    expectResults(maskedInput, 'm@k.', 2);

    await input(maskedInput, 'm@k', 3);
    expectResults(maskedInput, 'm@k.', 3);

    await input(maskedInput, 'm@k..', 5);
    expectResults(maskedInput, 'm@k.', 4);

    await input(maskedInput, 'm@k.s', 5);
    expectResults(maskedInput, 'm@k.s', 5);

    await input(maskedInput, 'm@ks', 3);
    expectResults(maskedInput, 'm@ks.', 3);

    await input(maskedInput, 'm@ks.a', 6);
    expectResults(maskedInput, 'm@ks.a', 6);

    await input(maskedInput, 'm.@ks.a', 2);
    expectResults(maskedInput, 'm.@ks.a', 2);

    await input(maskedInput, 'm.o@ks.a', 3);
    expectResults(maskedInput, 'm.o@ks.a', 3);
  })

})
