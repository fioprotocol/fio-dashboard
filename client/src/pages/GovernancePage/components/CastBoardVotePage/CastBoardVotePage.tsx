import React from 'react';
import { FIOSDK } from '@fioprotocol/fiosdk';

import PseudoModalContainer from '../../../../components/PseudoModalContainer';
import Loader from '../../../../components/Loader/Loader';
import CloseButton from '../../../../components/CloseButton/CloseButton';
import CustomDropdown from '../../../../components/CustomDropdown';
import RequestTokensEdgeWallet from '../../../FioTokensRequestPage/components/RequestTokensEdgeWallet';
import { RequestTokensMetamaskWallet } from '../../../FioTokensRequestPage/components/RequestTokensMetamaskWallet';
import RequestTokensLedgerWallet from '../../../FioTokensRequestPage/components/RequestTokensLedgerWallet';
import WalletAction from '../../../../components/WalletAction/WalletAction';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

import { NoAssociatedFioHandlesWarningBadge } from '../NoAssociatedFioHandlesWarningBadge/NoAssociatedFioHandlesWarningBadge';
import { CandidateIdBadge } from '../CandidateIdBadge/CandidateIdBadge';
import { NoCandidatesWarningBadge } from '../NoCandidatesWarningBadge/NoCandidatesWarningBadge';

import { ROUTES } from '../../../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';
import config from '../../../../config';

import MathOp from '../../../../util/math';

import { useContext } from './CastBoardVotePageContext';

import { GovernancePageContextProps } from '../../types';

import classes from './CastBoardVotePage.module.scss';

export const CastBoardVotePage: React.FC<GovernancePageContextProps> = props => {
  const {
    listOfCandidates,
    loading: candidatesListLoading,
    onCandidateSelectChange,
    resetSelectedCandidates,
  } = props;

  const selectedCandidates = listOfCandidates?.filter(({ checked }) => checked);

  const {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    notEnoughBundles,
    processing,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    walletsList,
    onActionClick,
    onCancel,
    onSuccess,
    onWalletChange,
    setProcessing,
  } = useContext({ resetSelectedCandidates, selectedCandidates });

  return (
    <>
      <PseudoModalContainer
        title="FIO Foundation Board Vote Request"
        link={ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}
      >
        <div className={classes.container}>
          <p className={classes.sendTo}>
            Send to: <span>{config.voteFioHandle}</span>
          </p>
          <h4 className={classes.label}>Your FIO Wallet</h4>
          <CustomDropdown
            options={walletsList}
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
            <NoAssociatedFioHandlesWarningBadge show />
          ) : (
            <>
              <CustomDropdown
                options={fioHandlesList}
                onChange={onWalletChange}
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
          <h4 className={classes.label}>
            Candidate Votes <span className={classes.regularText}>(max 8)</span>
          </h4>
          {candidatesListLoading ? (
            <Loader />
          ) : !selectedCandidates.length ? (
            <NoCandidatesWarningBadge
              show
              returnLink={ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}
            />
          ) : (
            <div className={classes.candidatesListContainer}>
              {selectedCandidates.map(({ image, name, id }) => (
                <div className={classes.candidateItem} key={id}>
                  <img
                    src={image}
                    alt="Candidate"
                    className={classes.candidateImage}
                  />
                  <div className={classes.nameContainer}>
                    <h4 className={classes.name}>{name}</h4>
                    <CandidateIdBadge
                      id={id}
                      className={classes.candidateBadge}
                    />
                  </div>
                  <CloseButton
                    handleClick={() => onCandidateSelectChange(id)}
                    className={classes.closeButton}
                  />
                </div>
              ))}
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
              !selectedCandidates.length ||
              selectedCandidates.length > 8 ||
              loading ||
              fioHandlesLoading ||
              candidatesListLoading ||
              notEnoughBundles ||
              new MathOp(selectedFioWallet?.available).eq(0)
            }
            loading={loading}
            withTopMargin={true}
            onClick={onActionClick}
          />
        </div>
      </PseudoModalContainer>

      <WalletAction
        fioWallet={selectedFioWallet}
        onCancel={onCancel}
        onSuccess={onSuccess}
        action={CONFIRM_PIN_ACTIONS.REQUEST}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        FioActionWallet={RequestTokensEdgeWallet}
        MetamaskActionWallet={RequestTokensMetamaskWallet}
        LedgerActionWallet={RequestTokensLedgerWallet}
      />
    </>
  );
};
