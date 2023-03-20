import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import classes from './WelcomeComponentItem.module.scss';

type Props = {
  actionButtonText: string;
  actionButtonLink: {
    pathname: string;
    state?: { openSettingsModal: string };
    search?: string;
  };
  imageSrc: string;
  isActionLinkExternal?: boolean;
  isRed?: boolean;
  title: string;
  text: React.ReactNode;
};

type ActionButtonProps = {
  actionButtonLink: {
    pathname: string;
    state?: { openSettingsModal: string };
    search?: string;
  };
  actionButtonText: string;
  isExternal: boolean;
  isRed: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = props => {
  const { actionButtonLink, actionButtonText, isExternal, isRed } = props;

  if (isExternal) {
    return (
      <a
        href={actionButtonLink.pathname}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SubmitButton
          hasAutoHeight
          isButtonType
          hasNoSidePaddings
          isRed={isRed}
          isWhite={!isRed}
          text={<span className={classes.buttonText}>{actionButtonText}</span>}
        />
      </a>
    );
  }
  return (
    <Link to={actionButtonLink}>
      <SubmitButton
        hasAutoHeight
        isButtonType
        hasNoSidePaddings
        isRed={isRed}
        isWhite={!isRed}
        text={<span className={classes.buttonText}>{actionButtonText}</span>}
      />
    </Link>
  );
};

export const WelcomeComponentItem: React.FC<Props> = props => {
  const {
    actionButtonText,
    actionButtonLink,
    imageSrc,
    isActionLinkExternal,
    isRed,
    title,
    text,
  } = props;

  return (
    <div className={classes.container}>
      <img src={imageSrc} alt={title} className={classes.img} />
      <h5 className={classnames(classes.title, isRed && classes.isRed)}>
        {title}
      </h5>
      <p className={classes.text}>{text}</p>
      <div className={classes.actionButtonContainer}>
        <ActionButton
          actionButtonText={actionButtonText}
          actionButtonLink={actionButtonLink}
          isExternal={isActionLinkExternal}
          isRed={isRed}
        />
      </div>
    </div>
  );
};
