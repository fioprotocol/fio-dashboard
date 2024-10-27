import { FC } from 'react';

import classnames from 'classnames';

import classes from '../styles/OverviewInfoBlock.module.scss';
import ActionButton from '../../SettingsPage/components/ActionButton';

export type OverviewInfoBlockProps = {
  className?: string;
  title: string;
  description: string;
  infoLabel: string;
  infoContent: string;
  actionLabel: string;
  actionHref: string;
};

export const OverviewInfoBlock: FC<OverviewInfoBlockProps> = ({
  className,
  title,
  description,
  infoLabel,
  infoContent,
  actionLabel,
  actionHref,
}) => {
  return (
    <div className={classnames(classes.container, className)}>
      <div className={classes.content}>
        <h5 className={classes.title}>{title}</h5>
        <p className={classes.description}>{description}</p>
      </div>
      <p className={classes.info}>
        <span className={classes.infoLabel}>{infoLabel}</span>
        <span className={classes.infoContent}>{infoContent}</span>
      </p>
      <ActionButton
        className={classes.actionButton}
        title={actionLabel}
        href={actionHref}
        isIndigo
      />
    </div>
  );
};
