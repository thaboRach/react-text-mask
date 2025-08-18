import React, { useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { Mask } from '../../types/Mask.js';
import createTextMaskInputElement from '../../core/createTextMaskInputElement.js';
import { Pipe } from '../../types/Pipe.js';
import { TextMaskInputElementResult } from '../../types/TextMaskInputElement.js';
import { isNil } from '../../utils/helpers.js';

type ComponentProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask?: Mask;
  type?: 'text' | 'tel' | 'url' | 'password' | 'search';
  guide?: boolean;
  value?: string;
  defaultValue?: string;
  pipe?: Pipe;
  placeholderChar?: string;
  keepCharPositions?: boolean;
  showMask?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  textMaskInputElementRef?: React.RefObject<TextMaskInputElementResult | null>;
};

type MaskedInputProps = ComponentProps & {
  render?: (ref: (inputElement: HTMLInputElement) => void, props: ComponentProps) => React.ReactNode;
};


function renderFunc(ref: (inputElement: HTMLInputElement) => void, props: ComponentProps) {
  const { mask, textMaskInputElementRef, ...restProps } = props
  return (<input ref={ref} {...restProps} />)
}

export function MaskedInput({
  render = renderFunc,
  mask,
  pipe,
  placeholderChar,
  keepCharPositions,
  value,
  showMask = false,
  onChange,
  onBlur,
  guide,
  textMaskInputElementRef,
  ...rest
}: MaskedInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textMaskInputElement = useRef<TextMaskInputElementResult | null>(null);
  const prevProps = useRef<MaskedInputProps>({} as MaskedInputProps);

  const setRef = useCallback((input: HTMLInputElement) => {
    inputRef.current = input;
  }, []);

  useImperativeHandle(textMaskInputElementRef, () => {
    return {
      update() {
        textMaskInputElement.current?.update();
      },
      state: {
        previousConformedValue: textMaskInputElement.current?.state?.previousConformedValue ?? '',
        previousPlaceholder: textMaskInputElement.current?.state?.previousPlaceholder ?? ''
      }
    }
  }, []);

  const initTextMask = useCallback(() => {
    if (inputRef.current) {
      textMaskInputElement.current = createTextMaskInputElement({
        inputElement: inputRef.current,
        mask,
        pipe,
        placeholderChar,
        keepCharPositions,
        guide: guide,
        showMask,
      });
      textMaskInputElement.current.update(value);
    }
  }, [mask, pipe, placeholderChar, keepCharPositions, guide, showMask, value]);

  useEffect(() => {
    initTextMask();
  }, [initTextMask]);


  useEffect(() => {
    const prev = prevProps.current;

    const isPipeChanged =
      typeof pipe === 'function' && typeof prev.pipe === 'function'
        ? pipe.toString() !== prev.pipe.toString()
        : (isNil(pipe) && !isNil(prev.pipe)) || (!isNil(pipe) && isNil(prev.pipe));

    const isMaskChanged = mask?.toString() !== prev.mask?.toString();

    const settingsChanged =
      guide !== prev.guide ||
      placeholderChar !== prev.placeholderChar ||
      showMask !== prev.showMask ||
      isPipeChanged ||
      isMaskChanged;

    const valueChanged = value !== inputRef.current?.value;

    if (settingsChanged || valueChanged) {
      initTextMask();
    }

    prevProps.current = {
      render,
      mask,
      pipe,
      placeholderChar,
      keepCharPositions,
      value,
      showMask,
      onChange,
      onBlur,
      guide,
      textMaskInputElementRef,
      ...rest,
    };
  }, [mask, pipe, placeholderChar, keepCharPositions, value, showMask, onChange, onBlur, guide, render, rest, initTextMask]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    textMaskInputElement.current?.update();
    onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  };

  return render(setRef, {
    mask,
    onBlur: handleBlur,
    onChange: handleChange,
    defaultValue: value,
    textMaskInputElementRef,
    ...rest,
  });
};

export { default as conformToMask } from '../../core/conformToMask.js';
