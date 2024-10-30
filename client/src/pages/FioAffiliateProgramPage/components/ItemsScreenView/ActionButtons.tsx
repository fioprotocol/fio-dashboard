import React, { useCallback } from 'react';
// import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import LibraryAddCheck from '@mui/icons-material/LibraryAddCheck';

import { BUTTONS_TITLE } from '../../../../components/ManagePageContainer/constants';
import { RenewActionButton } from '../../../../components/ManagePageContainer/components/ActionButtons';
// import { ROUTES } from '../../../../constants/routes';
// import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { useCheckIfSmallDesktop } from '../../../../screenType';

import { FioNameItemProps } from '../../../../types';

import classes from '../../../../components/ManagePageContainer/components/ActionButtons/ActionButtons.module.scss';

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

export const DomainActionButtons: React.FC<{
  fioNameItem: FioNameItemProps;
  isDesktop?: boolean;
  isExpired: boolean;
  onRenewDomain: (name: string) => void;
  onVisibilityChange: (name: string) => void;
}> = props => {
  const {
    fioNameItem,
    // isDesktop,
    isExpired,
    onRenewDomain,
    onVisibilityChange,
  } = props;

  const { isPublic, name } = fioNameItem;

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
