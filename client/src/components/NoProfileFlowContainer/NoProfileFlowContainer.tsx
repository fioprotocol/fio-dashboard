import React from 'react';
import { Redirect } from 'react-router';

import { RefFioHandleBanner } from '../RefFioHandleBanner';

import { FioPublicKeyComponent } from './components/FioPublicKeyComponent';

import { useContext } from './NoProfileFlowContainerContext';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';

import { RefProfile } from '../../types';

import classes from './NoProfileFlowContainer.module.scss';

type Props = {
  publicKey?: string;
};

export const NoProfileFlowContainer: React.FC<Props> = props => {
  const { children } = props;
  const {
    addressWidgetContent,
    refProfile,
    publicKey,
    loading,
    verificationParams,
  } = useContext();

  const domainName = refProfile?.settings?.domains[0]?.name || 'rulez';

  if (!refProfile?.settings?.hasNoProfileFlow && !loading) {
    return (
      <Redirect
        to={{
          pathname: `${ROUTES.REF_PROFILE_HOME.replace(
            REF_PROFILE_SLUG_NAME,
            refProfile?.code,
          )}`,
        }}
      />
    );
  }

  return (
    <div className={classes.container}>
      {!publicKey ? (
        <FioPublicKeyComponent
          addressWidgetContent={addressWidgetContent}
          verificationParams={verificationParams}
        />
      ) : (
        <PublicKeyProvider publicKey={publicKey} refProfile={refProfile}>
          {children}
        </PublicKeyProvider>
      )}
      <RefFioHandleBanner domainName={domainName} />
    </div>
  );
};

interface PublicKeyProviderProps {
  publicKey: string;
  refProfile: RefProfile;
  children: React.ReactNode;
}

const PublicKeyProvider: React.FC<PublicKeyProviderProps> = ({
  publicKey,
  refProfile,
  children,
}) => {
  if (React.isValidElement(children) && typeof children.type !== 'string') {
    return React.cloneElement(children as React.ReactElement, {
      publicKey,
      refProfile,
    });
  }
  return <>{children}</>;
};
