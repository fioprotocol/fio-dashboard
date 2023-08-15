import React, { ReactNode } from 'react';

import classes from '../AddressWidget.module.scss';

type Props = {
  logoSrc: string | null;
  title: string | ReactNode | null;
};

export const ContainedFlowSignNftTitle: React.FC = () => {
  return <h1 className={classes.title}>Hi! Let's Sign Your NFT</h1>;
};

export const ContainedFlowRegTitle: React.FC = () => {
  return <h1 className={classes.title}>Get your decentralized FIO Handle</h1>;
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
        <h1 className={classes.title}>{title}</h1>
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
