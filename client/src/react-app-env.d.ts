/// <reference types="react-scripts" />

import { GroupBase } from 'react-select';
declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<
    Option,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    IsMulti extends boolean,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    Group extends GroupBase<Option>
  > {
    prefix?: string;
  }
}
