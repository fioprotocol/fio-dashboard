import React from 'react';
import { FIOSDK } from '@fioprotocol/fiosdk';

import PseudoModalContainer from '../../../../components/PseudoModalContainer';

import CustomDropdown from '../../../../components/CustomDropdown';
import Loader from '../../../../components/Loader/Loader';
import CloseButton from '../../../../components/CloseButton/CloseButton';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import WalletAction from '../../../../components/WalletAction/WalletAction';

import { VoteProxyEdgeWallet } from './components/VoteProxyEdgeWallet';
import { VoteProxyLedgerWallet } from './components/VoteProxyLedgerWallet';
import { VoteProxyMetamaskWallet } from './components/VoteProxyMetamaskWallet';

import { ROUTES } from '../../../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';

import MathOp from '../../../../util/math';

import { NotUsingFioHandlesWarningBadge } from '../NotUsingFioHandlesWarningBadge/NotUsingFioHandlesWarningBadge';
import { NoCandidatesWarningBadge } from '../NoCandidatesWarningBadge/NoCandidatesWarningBadge';
import { useContext } from './ProxiesVotePageContext';

import { GovernancePageContextProps } from '../../types';

import classes from './ProxiesVotePage.module.scss';

export const ProxiesVotePage: React.FC<GovernancePageContextProps> = props => {
  const { listOfProxies, proxiesLoading, resetSelectedProxies } = props;

  const selectedProxy = listOfProxies.find(proxyItem => proxyItem.checked);

  const {
    fioHandlesList,
    fioHandlesLoading,
    fioWallets,
    loading,
    processing,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    transactionDetails,
    onActionClick,
    onCancel,
    onSuccess,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  } = useContext({ selectedProxy, resetSelectedProxies });

  return (
    <>
      <PseudoModalContainer
        title="Proxy Your Account"
        link={ROUTES.GOVERNANCE_PROXIES}
      >
        <div className={classes.container}>
          <div className={classes.proxyAccount}>
            Proxy account to: <span>{selectedProxy?.fioAddress}</span>
          </div>
          <h4 className={classes.label}>Your FIO Wallet</h4>
          <CustomDropdown
            options={fioWallets}
            onChange={onWalletChange}
            defaultOptionValue={selectedFioWallet}
            loading={loading}
            isWhite
            isSimple
            dropdownClassNames={classes.dropdown}
            withoutMarginBottom
          />
          <p className={classes.votingPower}>
            Current Voting Power:{' '}
            <span>
              {FIOSDK.SUFToAmount(selectedFioWallet?.available).toFixed(2)}
            </span>{' '}
            <span className={classes.violet}>FIO</span>
          </p>
          <h4 className={classes.label}>Proxy</h4>
          {proxiesLoading ? (
            <Loader />
          ) : !selectedProxy ? (
            <NoCandidatesWarningBadge
              show
              returnLink={ROUTES.GOVERNANCE_PROXIES}
            />
          ) : (
            <div className={classes.proxyItem}>
              <h4 className={classes.name}>{selectedProxy?.owner}</h4>
              <CloseButton
                handleClick={resetSelectedProxies}
                className={classes.closeButton}
              />
            </div>
          )}
          <h4 className={classes.label}>Your FIO Handle(s)</h4>
          {!fioHandlesList.length ? (
            <NotUsingFioHandlesWarningBadge show />
          ) : (
            <>
              <CustomDropdown
                options={fioHandlesList}
                onChange={onFioHandleChange}
                defaultOptionValue={selectedFioHandle}
                loading={fioHandlesLoading}
                isWhite
                isSimple
                dropdownClassNames={classes.dropdown}
                withoutMarginBottom
              />
            </>
          )}
          <p className={classes.label}>Transaction Details</p>
          <TransactionDetails
            {...transactionDetails}
            className={classes.transactionDetails}
          />
          <SubmitButton
            text="Vote Now"
            disabled={
              !selectedProxy ||
              proxiesLoading ||
              fioHandlesLoading ||
              new MathOp(selectedFioWallet?.available).eq(0)
            }
            loading={proxiesLoading}
            withTopMargin={true}
            onClick={onActionClick}
          />
        </div>
      </PseudoModalContainer>
      <WalletAction
        fioWallet={selectedFioWallet}
        onCancel={onCancel}
        onSuccess={onSuccess}
        action={CONFIRM_PIN_ACTIONS.VOTE_PRODUCER}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        FioActionWallet={VoteProxyEdgeWallet}
        LedgerActionWallet={VoteProxyLedgerWallet}
        MetamaskActionWallet={VoteProxyMetamaskWallet}
      />
    </>
  );
};
