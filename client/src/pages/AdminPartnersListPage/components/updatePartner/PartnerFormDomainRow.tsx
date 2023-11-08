import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { Button } from 'react-bootstrap';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import TextInput from '../../../../components/Input/TextInput';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

type Props = {
  field: string;
  index: number;
  isRemoveAvailable: boolean;
  onRemove: (index: number) => void;
};

export const PartnerFormDomainRow: React.FC<Props> = props => {
  const { field, index, isRemoveAvailable, onRemove } = props;

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <>
      <Field
        name={`${field}.name`}
        type="text"
        component={TextInput}
        placeholder="Domain"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        withoutBottomMargin
      />
      <Field
        type="checkbox"
        id={`${field}-premium`}
        component={Input}
        name={`${field}.isPremium`}
        wrapperClasses="ml-3"
        label="Premium"
      />
      <Field
        type="checkbox"
        id={`${field}-isFirstRegFree`}
        component={Input}
        name={`${field}.isFirstRegFree`}
        wrapperClasses="ml-3"
        label="First registration always free"
      />
      <Button
        className="w-25 ml-3 mb-0"
        variant="danger"
        onClick={handleRemove}
        disabled={!isRemoveAvailable}
      >
        Remove
      </Button>
    </>
  );
};
