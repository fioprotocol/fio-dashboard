import React from 'react';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import classes from './SocialMediaLinkItemComponent.module.scss';

type Props = {
  actionButton?: React.ReactNode;
  input?: React.ReactNode;
  showInput?: boolean;
  link: string;
  iconSrc: string;
  name: string;
};

export const SocialMediaLinkItemComponent: React.FC<Props> = props => {
  const { actionButton, input, iconSrc, link, showInput, name } = props;

  return (
    <Badge type={BADGE_TYPES.WHITE} show className={classes.container}>
      <div className={classes.imageContainer}>
        <img src={iconSrc} alt={link} className={classes.icon} />
        <p className={classes.name}>{name}</p>
      </div>
      {showInput ? (
        <div className={classes.inputContainer}>{input}</div>
      ) : (
        <p className={classes.link}>{link}</p>
      )}

      {actionButton && <div>{actionButton}</div>}
    </Badge>
  );
};
