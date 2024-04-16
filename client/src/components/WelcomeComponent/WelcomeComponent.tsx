import { FC } from 'react';
import classnames from 'classnames';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import { WelcomeComponentItem } from './components/WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { DefaultWelcomeComponentProps } from './types';

import WelcomePromoSrc from '../../assets/images/welcome-promo.svg';

import classes from './WelcomeComponent.module.scss';

type Props = {
  onlyActions?: boolean;
  noPaddingTop?: boolean;
  withoutMarginTop?: boolean;
} & DefaultWelcomeComponentProps;

export const WelcomeComponent: FC<Props> = props => {
  const {
    onlyActions = false,
    noPaddingTop = false,
    withoutMarginTop,
    hasAddresses,
  } = props;
  const {
    text,
    title,
    fioAddress,
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
    handleGetFioAddress,
    handleChangeFioAddress,
  } = useContext(props);

  return (
    <div
      className={classnames(
        classes.container,
        withoutMarginTop && classes.withoutMarginTop,
      )}
    >
      <div
        className={classnames(
          classes.contentContainer,
          noPaddingTop && classes.noPaddingTop,
        )}
      >
        {hasAddresses ? (
          <div className={classes.content}>
            {!onlyActions && <h2 className={classes.title}>{title}</h2>}
            {!onlyActions && <p className={classes.text}>{text}</p>}
            <div className={classes.actionItemContainer}>
              <WelcomeComponentItem
                content={firstWelcomeItem}
                loading={loading}
              />
              <WelcomeComponentItem
                content={secondWelcomeItem}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={classes.content}>
              <h2 className={classes.title}>{title}</h2>
              <p className={classes.text}>{text}</p>
              <div className={classes.form}>
                <div className={classes.inputWrapper}>
                  <input
                    className={classes.input}
                    placeholder="Enter your handle names"
                    value={fioAddress}
                    onChange={handleChangeFioAddress}
                  />
                </div>
                <SubmitButton
                  text="Get It"
                  isButtonType
                  hasLowHeight
                  hasAutoWidth
                  onClick={handleGetFioAddress}
                />
              </div>
            </div>
            <div className={classes.promo}>
              <img alt="welcome promo" src={WelcomePromoSrc} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
