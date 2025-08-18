import type { Meta, StoryObj } from '@storybook/react';

import { emailMask, MaskedInput } from '../../lib';

const meta = {
  title: 'Components/MaskedInput',
  component: MaskedInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mask: {
      type: 'string',
      control: 'object',
      description: 'The input mask to use which can be an array or a function',
    },
    type: {
      control: 'select',
      options: ['text', 'tel', 'url', 'password', 'search'],
      description: 'The type for the input',
    },
    guide: {
      control: 'boolean',
      description: 'It tells the component whether to be in guide or no guide mode',
    },
    pipe: {
      type: 'function',
      control: 'object',
      description:
        'A function that will give you the opportunity to modify the conformed value before it is displayed on the screen',
    },
    placeholderChar: {
      control: 'text',
      description: 'The placeholder character represents the fillable spot in the mask',
    },
    keepCharPositions: {
      control: 'boolean',
    },
    showMask: {
      control: 'boolean',
      description:
        'It tells the Text Mask component to display the mask as a placeholder in place of the regular placeholder when the input element value is empty',
    },
    render: {
      type: 'function',
      control: 'object',
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    onChange: {
      type: 'function',
      control: 'object',
    },
    onBlur: {
      type: 'function',
      control: 'object',
    },
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;
type Story = StoryObj<typeof meta>;
// ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

export const TelephoneInput: Story = {
  args: {
    mask: ["+", "1", " ", "(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
    type: 'tel',
    guide: false,
    placeholderChar: '_',
    showMask: true,
    keepCharPositions: false,
  },
};


export const EmailInput: Story = {
  args: {
    mask: emailMask.mask,
    type: 'tel',
    guide: false,
    placeholderChar: '_',
    showMask: true,
    keepCharPositions: false,
  },
};