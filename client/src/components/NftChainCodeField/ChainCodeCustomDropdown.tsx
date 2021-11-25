import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import CustomDropdown from '../CustomDropdown';

type Props = {
  options: { id: string; name: string };
  customValue: { id: string; name: string };
  toggleToCustom: (flag: boolean) => void;
  hasAutoWidth?: boolean;
  isShort?: boolean;
  isSimple?: boolean;
  isHigh?: boolean;
};

const ChainCodeCustomDropdown: React.FC<FieldRenderProps<Props>> = props => {
  const {
    input,
    options,
    customValue,
    toggleToCustom,
    placeholder,
    hasAutoWidth,
    isShort,
    isSimple,
    isHigh,
  } = props;
  const { onChange } = input;
  return (
    <CustomDropdown
      onChange={onChange}
      options={options}
      customValue={customValue}
      toggleToCustom={toggleToCustom}
      placeholder={placeholder}
      isShort={isShort}
      isSimple={isSimple}
      isWhite={true}
      hasAutoWidth={hasAutoWidth}
      isHigh={isHigh}
    />
  );
};

export default ChainCodeCustomDropdown;
