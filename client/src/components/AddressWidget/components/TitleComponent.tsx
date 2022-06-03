import React, { ReactNode } from 'react';
import classnames from 'classnames';

import classes from '../AddressWidget.module.scss';

type Props = {
  logoSrc: string | null;
  title: string | ReactNode | null;
};

export const ContainedFlowSignNftTitle: React.FC = () => {
  return (
    <h1 className={classes.title}>
      <span className="boldText">Hi!</span> Let's{' '}
      <span className={classes.newLine}>
        <span className={classnames(classes.coloredText, 'boldText')}>
          Sign Your NFT
        </span>
      </span>
    </h1>
  );
};

const TitleComponent: React.FC<Props> = props => {
  const { logoSrc, title } = props;

  if (logoSrc)
    return (
      <div className="mb-5">
        <img src={logoSrc} className={classes.logoImg} alt="" />
      </div>
    );

  if (title) return <>{title}</>;

  return (
    <h1 className={classes.title}>
      <span className="boldText">Hi!</span> Get Your{' '}
      <span className={classes.newLine}>
        <span className={classnames(classes.coloredText, 'boldText')}>
          FIO Crypto Handle
        </span>{' '}
        Now
      </span>
    </h1>
  );
};

export default TitleComponent;
