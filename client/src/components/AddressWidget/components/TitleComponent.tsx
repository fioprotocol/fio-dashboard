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

export const ContainedFlowRegTitle: React.FC = () => {
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

const TitleComponent: React.FC<Props> = props => {
  const { logoSrc, title } = props;

  const renderLogo = () => {
    return logoSrc ? (
      <div className="mb-5">
        <img src={logoSrc} className={classes.logoImg} alt="" />
      </div>
    ) : null;
  };
  const renderTitle = () => {
    return title ? (
      typeof title === 'string' ? (
        <h1 className={classes.customTitle}>{title}</h1>
      ) : (
        <>{title}</>
      )
    ) : (
      <ContainedFlowRegTitle />
    );
  };

  return (
    <>
      {renderLogo()}
      {renderTitle()}
    </>
  );
};

export default TitleComponent;
