import React, { useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import Loader from '../../../Loader/Loader';

import classes from './WelcomeComponentItem.module.scss';

type Props = {
  content: {
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
  loading?: boolean;
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
  const { content, loading } = props;

  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) return <Loader />;

  if (!content) return null;

  const {
    actionButtonText,
    actionButtonLink,
    imageSrc,
    isActionLinkExternal,
    isRed,
    title,
    text,
  } = content;

  return (
    <div className={classes.container}>
      <img
        src={imageSrc}
        alt={title}
        className={classnames(classes.img, !imageLoaded && classes.isLoading)}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && <Loader />}
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
