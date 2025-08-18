import { ConformMaskConfig } from './Config';
import { Pipe } from './Pipe';

export type MaskArray = (RegExp | string)[] | boolean;

export type MaskFunc = (rawValue: string, config: ConformMaskConfig) => MaskArray;

export type MaskObject = {
  mask: MaskArray | MaskFunc;
  pipe: Pipe;
};

export type Mask = MaskArray | MaskFunc | MaskObject;
