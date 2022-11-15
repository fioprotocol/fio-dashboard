import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import classes from '../../AdminPartnersListPage.module.scss';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

type Props = {
  field: string;
  index: number;
  value: string;
  isDefault: boolean;
  isRemoveAvailable: boolean;
  onSetDefaultDomain: (value: string) => void;
  onRemove: (index: number) => void;
};

export const PartnerFormDomainRow: React.FC<Props> = props => {
  const {
    field,
    index,
    value,
    isDefault,
    isRemoveAvailable,
    onSetDefaultDomain,
    onRemove,
  } = props;

  const handleSetDefault = useCallback(() => {
    onSetDefaultDomain(value);
  }, [onSetDefaultDomain, value]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="d-flex">
      <Field
        name={field}
        type="text"
        component={Input}
        placeholder="Domain"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
      />

      <Button
        onClick={handleSetDefault}
        variant="secondary"
        className={classnames(classes.button, 'w-25', 'ml-3')}
        disabled={isDefault}
      >
        {isDefault ? 'Default' : 'Set default'}
      </Button>
      <Button
        className="w-25 ml-3"
        variant="danger"
        onClick={handleRemove}
        disabled={!isRemoveAvailable}
      >
        Remove
      </Button>
    </div>
  );
};
