import { MainConfig } from './Config';

export type TextMaskInputElementResult = {
  state: {
    previousConformedValue: string;
    previousPlaceholder: string;
  };
  update(rawValue?: string | number | null, config?: MainConfig): void;
};
