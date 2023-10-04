import React, { useCallback, useState } from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import { SideMenu } from '../MainHeader/components/SideMenu/SideMenu';

import { ROUTES } from '../../constants/routes';

import FioLogoSrc from '../../assets/images/fio-logo.svg';

import classes from './FioProfileActionBadge.module.scss';

export const ACTION_BUTTONS_NAMES: {
  [key: string]:
    | 'GET_FIO_HANDLE'
    | 'MANAGE_FIO_HANDLE'
    | 'LEARN_MORE_ABOUT_FIO';
} = {
  GET_FIO_HANDLE: 'GET_FIO_HANDLE',
  MANAGE_FIO_HANDLE: 'MANAGE_FIO_HANDLE',
  LEARN_MORE_ABOUT_FIO: 'LEARN_MORE_ABOUT_FIO',
};

const ACTION_BUTTONS_CONTENT = {
  [ACTION_BUTTONS_NAMES.GET_FIO_HANDLE]: {
    addFioBaseUrl: true,
    buttonProps: {
      isWhiteViolet: true,
      text: 'Get Your Own FIO Handle',
    },
    link: ROUTES.FIO_ADDRESSES_SELECTION,
  },
  [ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE]: {
    addFioBaseUrl: true,
    buttonProps: {
      text: 'Manage Your FIO Handle',
    },
    link: ROUTES.DASHBOARD,
  },
  [ACTION_BUTTONS_NAMES.LEARN_MORE_ABOUT_FIO]: {
    buttonProps: {
      isWhiteViolet: true,
      text: 'Learn More About FIO',
    },
    link: 'https://fio.net/',
  },
};

type ActionButtonType = keyof typeof ACTION_BUTTONS_NAMES;

type DefaultProps = {
  actionButtons: ActionButtonType[];
  fioBaseUrl: string;
  hasButtonMenu?: boolean;
};

type Props = DefaultProps;

type ActionButtonsContainerProps = DefaultProps & {
  isMenuOpen?: boolean;
  toggleMenuOpen?: (isMenuOpen: boolean) => void;
};

type ActionButtonsProps = DefaultProps & {
  hasNoSidePaddings?: boolean;
  closeMenu?: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = props => {
  const { actionButtons, fioBaseUrl, hasNoSidePaddings, closeMenu } = props;

  return (
    <>
      {actionButtons.map(actionButton => {
        const { addFioBaseUrl, buttonProps, link } = ACTION_BUTTONS_CONTENT[
          actionButton
        ];

        const linkTo = addFioBaseUrl ? fioBaseUrl + link : link;

        return (
          <a
            href={linkTo}
            target="_blank"
            rel="noopener noreferrer"
            key={linkTo}
          >
            <SubmitButton
              {...buttonProps}
              className={classes.button}
              hasNoSidePaddings={hasNoSidePaddings}
              onClick={closeMenu}
            />
          </a>
        );
      })}
    </>
  );
};

const ActionButtonsContainer: React.FC<ActionButtonsContainerProps> = props => {
  const {
    actionButtons,
    fioBaseUrl,
    hasButtonMenu,
    isMenuOpen,
    toggleMenuOpen,
  } = props;

  const closeMenu = useCallback(() => {
    toggleMenuOpen(false);
  }, [toggleMenuOpen]);

  if (hasButtonMenu)
    return (
      <SideMenu
        isMenuOpen={isMenuOpen}
        toggleMenuOpen={toggleMenuOpen}
        menuClassNames={classes.menu}
      >
        <div className={classes.menuActionButtons}>
          <ActionButtons
            actionButtons={actionButtons}
            fioBaseUrl={fioBaseUrl}
            hasNoSidePaddings
            closeMenu={closeMenu}
          />
        </div>
      </SideMenu>
    );

  return (
    <div className={classes.actionButtonsContainer}>
      <ActionButtons actionButtons={actionButtons} fioBaseUrl={fioBaseUrl} />
    </div>
  );
};

export const FioProfileActionBadge: React.FC<Props> = props => {
  const { fioBaseUrl, hasButtonMenu } = props;

  const [isMenuOpen, toggleMenuOpen] = useState<boolean>();

  return (
    <Badge
      show
      type={BADGE_TYPES.WHITE}
      className={classnames(
        classes.badge,
        hasButtonMenu && classes.hasButtonMenu,
        isMenuOpen && classes.isMenuOpen,
      )}
    >
      <a href={fioBaseUrl} target="_blank" rel="noopener noreferrer">
        <img src={FioLogoSrc} alt="FIO Logo" className={classes.logo} />
      </a>
      <ActionButtonsContainer
        {...props}
        isMenuOpen={isMenuOpen}
        toggleMenuOpen={toggleMenuOpen}
      />
    </Badge>
  );
};
