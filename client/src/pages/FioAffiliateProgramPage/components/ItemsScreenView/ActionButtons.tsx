import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import LibraryAddCheck from '@mui/icons-material/LibraryAddCheck';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import { BUTTONS_TITLE } from '../../../../components/ManagePageContainer/constants';
import { RenewActionButton } from '../../../../components/ManagePageContainer/components/ActionButtons';

import { useCheckIfSmallDesktop } from '../../../../screenType';

import { FioNameItemProps } from '../../../../types';

import classes from '../../../../components/ManagePageContainer/components/ActionButtons/ActionButtons.module.scss';
import uiClasses from './UIView.module.scss';

type CheckedIconProps = {
  isChecked: boolean;
  disabled: boolean;
  onClick: () => void;
};

type DefaultProps = {
  isExpired?: boolean;
  isSmallDesktop: boolean;
  name: string;
};

const ActionButtonsContainer: React.FC = props => (
  <div
    className={classnames(classes.actionButtonsContainer, classes.leftAlign)}
  >
    {props.children}
  </div>
);

const VisibilityActionButton: React.FC<{
  onVisibilityChange: (name: string) => void;
} & DefaultProps> = props => {
  const { isSmallDesktop, name, onVisibilityChange } = props;

  const handleVisibilityChange = useCallback(() => {
    onVisibilityChange(name);
  }, [name, onVisibilityChange]);

  return (
    <div onClick={handleVisibilityChange} className={classes.actionButton}>
      <Button title={isSmallDesktop ? BUTTONS_TITLE.makePublic : ''}>
        <LibraryAddCheck />
        {!isSmallDesktop && BUTTONS_TITLE.makePublic}
      </Button>
    </div>
  );
};

export const CheckedIcon: React.FC<CheckedIconProps> = props => {
  const { isChecked, onClick } = props;

  return isChecked ? (
    <CheckBoxIcon className={uiClasses.checkIcon} onClick={onClick} />
  ) : (
    <CheckBoxOutlineBlankIcon
      className={uiClasses.checkIcon}
      onClick={onClick}
    />
  );
};

export const DomainActionButtons: React.FC<{
  fioDomain: FioNameItemProps;
  isDesktop?: boolean;
  isExpired: boolean;
  onRenewDomain: (name: string) => void;
  onVisibilityChange: (name: string) => void;
}> = props => {
  const { fioDomain, isExpired, onRenewDomain, onVisibilityChange } = props;

  const { isPublic, name } = fioDomain;

  const isSmallDesktop = useCheckIfSmallDesktop();

  const defaultProps = {
    isExpired,
    isSmallDesktop,
    name,
  };

  return (
    <ActionButtonsContainer>
      <RenewActionButton {...defaultProps} onRenewDomain={onRenewDomain} />
      {!isPublic && (
        <VisibilityActionButton
          {...defaultProps}
          onVisibilityChange={onVisibilityChange}
        />
      )}
    </ActionButtonsContainer>
  );
};
