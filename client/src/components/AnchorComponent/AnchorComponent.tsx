import React from 'react';
import { Link } from 'react-scroll';

import classes from './AnchorComponent.module.scss';

const DURATION_TIME = 250;
const DELAY_TIME = 100;
const OFFSET = -50;

type Props = {
  to: string;
  smooth?: boolean;
  duration?: number;
  delay?: number;
  offset?: number;
  title?: string;
};

export const AnchorComponent: React.FC<Props> = props => {
  const {
    children,
    to,
    smooth = true,
    duration = DURATION_TIME,
    delay = DELAY_TIME,
    offset = OFFSET,
    title,
  } = props;
  return (
    <Link
      to={to}
      smooth={smooth}
      duration={duration}
      delay={delay}
      offset={offset}
      title={title}
      className={classes.anchor}
    >
      {children}
    </Link>
  );
};
