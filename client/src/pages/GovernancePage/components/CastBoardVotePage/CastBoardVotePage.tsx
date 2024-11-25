import React from 'react';

import PseudoModalContainer from '../../../../components/PseudoModalContainer';
import Loader from '../../../../components/Loader/Loader';
import CustomDropdown from '../../../../components/CustomDropdown';
import RequestTokensEdgeWallet from '../../../FioTokensRequestPage/components/RequestTokensEdgeWallet';
import { RequestTokensMetamaskWallet } from '../../../FioTokensRequestPage/components/RequestTokensMetamaskWallet';
import RequestTokensLedgerWallet from '../../../FioTokensRequestPage/components/RequestTokensLedgerWallet';
import WalletAction from '../../../../components/WalletAction/WalletAction';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';
import { ResultDetails } from '../../../../components/ResultDetails/ResultDetails';
import Amount from '../../../../components/common/Amount';

import { NoAssociatedFioHandlesWarningBadge } from '../NoAssociatedFioHandlesWarningBadge/NoAssociatedFioHandlesWarningBadge';
import { NoCandidatesWarningBadge } from '../NoCandidatesWarningBadge/NoCandidatesWarningBadge';
import { CandidateBoardItems } from './components/CandidateBoardItems/CandidateBoardItems';
import { LowBalanceComponent } from '../LowBalanceComponent/LowBalanceComponent';
import { ProxiedWalletWarningBadge } from '../ProxiedWalletWarningBadge/ProxiedWalletWarningBadge';
import { LowBalanceTokens } from '../LowBalanceComponent/LowBalanceTokens';

import { ROUTES } from '../../../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';
import { LOW_BUNDLES_TEXT } from '../../../../constants/errors';

import apis from '../../../../api';
import { lowBalanceAction } from '../../../../util/transactions';

import { useContext } from './CastBoardVotePageContext';

import { GovernancePageContextProps } from '../../types';

import classes from './CastBoardVotePage.module.scss';

export const CastBoardVotePage: React.FC<GovernancePageContextProps> = props => {
  const {
    listOfCandidates,
    loading: candidatesListLoading,
    overviewWallets,
    onCandidateSelectChange,
    resetSelectedCandidates,
  } = props;

  const selectedCandidates = listOfCandidates?.filter(({ checked }) => checked);

  const {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    notEnoughBundles,
    notEnoughTokens,
    processing,
    resultsData,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    voteFioHandle,
    onActionClick,
    onCancel,
    onLowBalanceClick,
    onResultsClose,
    onSuccess,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  } = useContext({
    resetSelectedCandidates,
    selectedCandidates,
    overviewWallets,
  });

  if (resultsData) {
    return (
      <PseudoModalContainer
        title={<span className={classes.title}>Board Vote Confirmation</span>}
        onClose={onResultsClose}
      >
        <div className={classes.container}>
          <ResultDetails label="Receiving Vote Handle" value={voteFioHandle} />
          <ResultDetails
            label="Voting Wallet"
            value={selectedFioWallet?.name}
          />
          <h4 className={classes.label}>Candidate votes</h4>
          <CandidateBoardItems
            hideCloseButton
            selectedCandidates={selectedCandidates}
          />
          <ResultDetails
            label="Voting Handle"
            value={selectedFioHandle?.name}
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
          <span className={classes.title}>
            FIO Foundation Board Vote Request
          </span>
        }
        link={ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}
      >
        <div className={classes.container}>
          <p className={classes.sendTo}>
            Send to: <span>{voteFioHandle}</span>
          </p>
          <h4 className={classes.label}>Your FIO Wallet</h4>
          <CustomDropdown
            options={overviewWallets}
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
              <Amount>
                {apis.fio.sufToAmount(selectedFioWallet?.balance)}
              </Amount>
            </span>{' '}
            <span className={classes.violet}>FIO</span>
          </p>
          {selectedFioWallet?.hasProxy && <ProxiedWalletWarningBadge />}
          <LowBalanceTokens
            hasLowBalance={notEnoughTokens}
            onActionClick={lowBalanceAction}
          />
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
            <CandidateBoardItems
              selectedCandidates={selectedCandidates}
              onCandidateSelectChange={onCandidateSelectChange}
            />
          )}
          <h4 className={classes.label}>Your FIO Handle(s)</h4>
          {!fioHandlesList.length ? (
            <NoAssociatedFioHandlesWarningBadge show />
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
          <p className={classes.label}>Transaction Details</p>
          <TransactionDetails
            bundles={{
              remaining: selectedFioHandle?.remaining,
              fee: BUNDLES_TX_COUNT.NEW_FIO_REQUEST,
            }}
            className={classes.transactionDetails}
          />
          <LowBalanceComponent
            hasLowBalance={notEnoughBundles}
            onActionClick={onLowBalanceClick}
            {...LOW_BUNDLES_TEXT}
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
              notEnoughTokens ||
              selectedFioWallet?.hasProxy ||
              !fioHandlesList.length
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
