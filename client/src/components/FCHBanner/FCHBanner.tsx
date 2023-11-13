import React from 'react';
import classnames from 'classnames';

import classes from './FCHBanner.module.scss';

type Props = {
  containerClass?: string;
  customFioHandleBanner?: React.ReactNode;
  fch: string;
  fioHandleClass?: string;
  mainTextClass?: string;
  publicKeyWrapperClass?: string;
  publicKeyClass?: string;
  subtextClass?: string;
  text?: string;
};

export const FCHBanner: React.FC<Props> = ({
  containerClass,
  customFioHandleBanner,
  fch,
  fioHandleClass,
  mainTextClass,
  publicKeyWrapperClass,
  publicKeyClass,
  subtextClass,
  text = 'Now people will be able to send crypto to',
}) => {
  return (
    <div className={classnames(classes.container, containerClass)}>
      <div className={classes.center}>
        <div className={classes.row}>
          <div className={classnames(classes.text, mainTextClass)}>{text}</div>
          {customFioHandleBanner ? (
            customFioHandleBanner
          ) : (
            <div className={classes.fchWrapper}>
              <div className={classnames(classes.fch, fioHandleClass)}>
                {fch}
              </div>
            </div>
          )}
        </div>
        <div className={classes.row}>
          <div className={classnames(classes.text, subtextClass)}>
            instead of
          </div>
          <div
            className={classnames(
              classes.publicKeyWrapper,
              publicKeyWrapperClass,
            )}
          >
            <div className={classnames(classes.publicKey, publicKeyClass)}>
              bc1qxy2kgdygjrsqtzq2n0yrf3293p93kkfjhx0wlh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
