import React from 'react';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import classes from './SocialMediaLinkItemComponent.module.scss';

type Props = {
  actionButton?: React.ReactNode;
  combineInputAndLink?: boolean;
  input?: React.ReactNode;
  showInput?: boolean;
  link: string;
  iconSrc: string;
  name: string;
  hasOpacity?: boolean;
};

export const SocialMediaLinkItemComponent: React.FC<Props> = props => {
  const {
    actionButton,
    combineInputAndLink,
    input,
    iconSrc,
    link,
    showInput,
    name,
    hasOpacity,
  } = props;

  return (
    <Badge
      type={BADGE_TYPES.WHITE}
      show
      className={classnames(
        classes.container,
        actionButton && classes.hasActionButton,
      )}
    >
      <div
        className={classnames(
          classes.imageContainer,
          hasOpacity && classes.hasOpacity,
        )}
      >
        <img src={iconSrc} alt={link} className={classes.icon} />
        <p className={classes.name}>{name}</p>
      </div>
      {showInput ? (
        <div
          className={classnames(
            classes.inputContainer,
            hasOpacity && classes.hasOpacity,
          )}
        >
          {combineInputAndLink && (
            <p className={classnames(classes.link, classes.hasNoWardBreak)}>
              {link}
            </p>
          )}
          <div className={classes.input}>{input}</div>
        </div>
      ) : (
        <p
          className={classnames(classes.link, hasOpacity && classes.hasOpacity)}
        >
          {link}
        </p>
      )}

      {actionButton && (
        <div className={classes.actionButton}>{actionButton}</div>
      )}
    </Badge>
  );
};
