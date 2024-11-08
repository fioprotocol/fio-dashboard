import React from 'react';
import { FIOSDK } from '@fioprotocol/fiosdk';

import { GovernancePageContextProps } from '../../types';

import PseudoModalContainer from '../../../../components/PseudoModalContainer';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import CustomDropdown from '../../../../components/CustomDropdown';
import CloseButton from '../../../../components/CloseButton/CloseButton';
import Loader from '../../../../components/Loader/Loader';
import WalletAction from '../../../../components/WalletAction/WalletAction';

import { BUNDLES_TX_COUNT } from '../../../../constants/fio';
import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { ROUTES } from '../../../../constants/routes';

import MathOp from '../../../../util/math';

import { NoCandidatesWarningBadge } from '../NoCandidatesWarningBadge/NoCandidatesWarningBadge';
import { NoAssociatedFioHandlesWarningBadge } from '../NoAssociatedFioHandlesWarningBadge/NoAssociatedFioHandlesWarningBadge';
import { useContext } from './CastBlockProducerVotePageContext';

import classes from './CastBlockProducerVotePage.module.scss';

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
    loading,
    processing,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    onActionClick,
    onCancel,
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

  return (
    <>
      <PseudoModalContainer
        title="Block Producer Vote Request"
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
            <span>
              {FIOSDK.SUFToAmount(selectedFioWallet?.available).toFixed(2)}
            </span>{' '}
            <span className={classes.violet}>FIO</span>
          </p>
          <h4 className={classes.label}>Your FIO Handle(s)</h4>
          {!fioHandlesList.length ? (
            <NoAssociatedFioHandlesWarningBadge
              show
              customMessage="You may still vote for Block Producers, but you will pay a small fee to complete this request. See Transaction Fees Below."
            />
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
              <p className={classes.votingPower}>
                Current Voting Power:{' '}
                <span>{selectedFioHandle?.remaining || 0}</span>{' '}
                <span className={classes.violet}>Bundles</span>
              </p>
            </>
          )}
          <h4 className={classes.label}>Candidate Votes</h4>
          {bpLoading ? (
            <Loader />
          ) : !selectedBlockProducers.length ? (
            <NoCandidatesWarningBadge
              show
              returnLink={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
            />
          ) : (
            <div className={classes.candidatesListContainer}>
              {selectedBlockProducers.map(
                ({ logo, defaultDarkLogo, fioAddress, id }) => (
                  <div className={classes.candidateItem} key={id}>
                    <img
                      src={logo || defaultDarkLogo}
                      alt="Block Producer"
                      className={classes.candidateImage}
                    />
                    <h4 className={classes.name}>{fioAddress}</h4>
                    <CloseButton
                      handleClick={() => onBlockProducerSelectChange(id)}
                      className={classes.closeButton}
                    />
                  </div>
                ),
              )}
            </div>
          )}
          <p className={classes.label}>Transaction Details</p>
          <TransactionDetails
            bundles={{
              remaining: selectedFioHandle?.remaining,
              fee: BUNDLES_TX_COUNT.NEW_FIO_REQUEST,
            }}
            className={classes.transactionDetails}
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
      />
    </>
  );
};
