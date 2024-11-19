import React from 'react';

import PseudoModalContainer from '../../../../components/PseudoModalContainer';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import CustomDropdown from '../../../../components/CustomDropdown';
import Loader from '../../../../components/Loader/Loader';
import WalletAction from '../../../../components/WalletAction/WalletAction';
import { ResultDetails } from '../../../../components/ResultDetails/ResultDetails';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { ROUTES } from '../../../../constants/routes';

import MathOp from '../../../../util/math';
import apis from '../../../../api';

import { NoCandidatesWarningBadge } from '../NoCandidatesWarningBadge/NoCandidatesWarningBadge';
import { NotUsingFioHandlesWarningBadge } from '../NotUsingFioHandlesWarningBadge/NotUsingFioHandlesWarningBadge';
import { VoteBlockProducerEdgeWallet } from './components/VoteBlockProducerEdgeWallet';
import { VoteBlockProducerLedgerWallet } from './components/VoteBlockProducerLedgerWallet';
import { VoteBlockProducerMetamaskWallet } from './components/VoteBlockProducerMetamaskWallet';
import { CandidateItem } from './components/CandidateItem/CandidateItem';
import { LowBalanceComponent } from '../LowBalanceComponent/LowBalanceComponent';

import { useContext } from './CastBlockProducerVotePageContext';

import { GovernancePageContextProps } from '../../types';

import classes from './CastBlockProducerVotePage.module.scss';
import { LOW_BALANCE_AND_BUNDLES_TEXT } from '../../../../constants/errors';

export const CastBlockProducerVotePage: React.FC<GovernancePageContextProps> = props => {
  const {
    listOfBlockProducers,
    bpLoading,
    onBlockProducerSelectChange,
    resetSelectedBlockProducers,
  } = props;

  const selectedBlockProducers = listOfBlockProducers?.filter(
    ({ checked }) => checked,
  );

  const {
    fioHandlesList,
    fioHandlesLoading,
    fioWallets,
    hasLowBalance,
    loading,
    processing,
    resultsData,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    transactionDetails,
    onActionClick,
    onCancel,
    onLowBalanceClick,
    onResultsClose,
    onSuccess,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  } = useContext({
    resetSelectedBlockProducers,
    selectedBlockProducersFioHandles: selectedBlockProducers.map(
      ({ fioAddress }) => fioAddress,
    ),
  });

  if (resultsData) {
    return (
      <PseudoModalContainer
        title={
          <span className={classes.title}>
            Block Producer Vote Confirmation
          </span>
        }
        onClose={onResultsClose}
      >
        <div className={classes.container}>
          <ResultDetails
            label="Your FIO Wallet"
            value={selectedFioWallet?.name}
          />
          <h4 className={classes.label}>Candidate votes</h4>
          <CandidateItem
            hideCloseButton
            selectedBlockProducers={selectedBlockProducers}
          />
          <p className={classes.label}>Transaction Details</p>
          <TransactionDetails
            {...resultsData}
            className={classes.transactionDetails}
          />
          <SubmitButton
            text="Close"
            onClick={onResultsClose}
            withTopMargin={true}
          />
        </div>
      </PseudoModalContainer>
    );
  }

  return (
    <>
      <PseudoModalContainer
        title={
          <span className={classes.title}>Block Producer Vote Request</span>
        }
        link={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
      >
        <div className={classes.container}>
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
            <span>{apis.fio.sufToAmount(selectedFioWallet?.available)}</span>{' '}
            <span className={classes.violet}>FIO</span>
          </p>
          <h4 className={classes.label}>Candidate Votes</h4>
          {bpLoading ? (
            <Loader />
          ) : !selectedBlockProducers.length ? (
            <NoCandidatesWarningBadge
              show
              returnLink={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
            />
          ) : (
            <CandidateItem
              selectedBlockProducers={selectedBlockProducers}
              onBlockProducerSelectChange={onBlockProducerSelectChange}
            />
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
          <LowBalanceComponent
            hasLowBalance={hasLowBalance}
            onActionClick={onLowBalanceClick}
            {...LOW_BALANCE_AND_BUNDLES_TEXT}
          />
          <SubmitButton
            text="Vote Now"
            disabled={
              !selectedBlockProducers.length ||
              bpLoading ||
              fioHandlesLoading ||
              new MathOp(selectedFioWallet?.available).eq(0)
            }
            loading={bpLoading}
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
        FioActionWallet={VoteBlockProducerEdgeWallet}
        LedgerActionWallet={VoteBlockProducerLedgerWallet}
        MetamaskActionWallet={VoteBlockProducerMetamaskWallet}
      />
    </>
  );
};
