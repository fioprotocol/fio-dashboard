import React from 'react';

import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';

import Modal from '../../../../components/Modal/Modal';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import { CommandComponent } from './CommandComponent';

import { BADGE_TYPES } from '../../../Badge/Badge';
import { WRAP_ITEM_STATUS } from '../../../../constants/wrap';
import {
  WRAP_STATUS_CONTENT,
  OPERATION_TYPES,
  ASSET_TYPES,
  OperationType,
  AssetType,
} from '../constants';

import {
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getActionTitle,
} from '../utils';

import { formatDateToLocale } from '../../../../helpers/stringFormatters';
import { renderFioPriceFromSuf } from '../../../../util/fio';

import { AnyType, WrapStatusWrapItem } from '../../../../types';

import classes from './../WrapStatus.module.scss';

type Props = {
  itemData?: WrapStatusWrapItem;
  onClose: () => void;
  operationType: OperationType;
  assetType: AssetType;
  chainCode: string;
};

const DetailsModal: React.FC<Props> = props => {
  const {
    chainCode: defaultChainCode,
    itemData,
    onClose,
    operationType,
    assetType,
  } = props;

  const isWrap = operationType === OPERATION_TYPES.WRAP;
  const isBurned = operationType === OPERATION_TYPES.BURNED;
  const isTokens = assetType === ASSET_TYPES.TOKENS;

  const {
    actionType,
    amount,
    approvals,
    blockNumber,
    blockTimestamp,
    chain,
    domain,
    escrowAccount,
    from,
    oracleId,
    status,
    to,
    tpid,
    transactionId,
    voters,
  } = itemData || {};

  const isPending = status === WRAP_ITEM_STATUS.PENDING;
  const isFailed = status === WRAP_ITEM_STATUS.FAILED;

  let obtid = oracleId || transactionId;
  const tokenId = voters?.length ? voters[0]?.tokenId : null;

  if (voters?.length) {
    const counts = voters.reduce((acc: Record<string, number>, obj) => {
      const value = obj.obtid;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    // Find the value with maximum count
    obtid = Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  const chainCode = approvals?.chainCode || defaultChainCode;

  const wrapTokenFailedCommand = `npm run oracle wrap tokens chainCode:${chainCode} amount:${amount} address:${to} obtId:${obtid}`;
  const wrapDomainFailedCommand = `npm run oracle wrap nfts chainCode:${chainCode} nftName:${domain} address:${to} obtId:${obtid}`;
  const unwrapTokenFailedCommand = `npm run oracle unwrap tokens chainCode:${chainCode} amount:${amount} address:${to} obtId:${obtid}`;
  const unwrapDomainFailedCommand = `npm run oracle unwrap nfts chainCode:${chainCode} nftName:${domain} address:${to} obtId:${obtid}`;
  const burnDomainFailedCommand = `npm run oracle burn nfts chainCode:${chainCode} nftName:${domain} tokenId:${tokenId} obtId:${obtid}`;

  const wrapCommand = isWrap
    ? isTokens
      ? wrapTokenFailedCommand
      : wrapDomainFailedCommand
    : isTokens
    ? unwrapTokenFailedCommand
    : isBurned
    ? burnDomainFailedCommand
    : unwrapDomainFailedCommand;

  const explorerTxUrl = getExplorerTxUrl(chain);

  const voterExplorerTxUrl = getExplorerTxUrl(chainCode);
  const voterExplorerAddressUrl = getExplorerAddressUrl(chainCode);

  return (
    <Modal
      show={!!itemData}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
      onClose={onClose}
    >
      <div className="d-flex flex-column w-100">
        <h3 className="d-flex mt-2 mb-3 justify-content-between">
          <div>{getActionTitle({ operationType, assetType })}</div>
          {itemData ? (
            <Badge variant={WRAP_STATUS_CONTENT[itemData.status]?.type}>
              {WRAP_STATUS_CONTENT[itemData.status]?.text}
            </Badge>
          ) : null}
        </h3>
        {itemData ? (
          <div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Trx_id:</b>
              </div>
              <div className={classNames(classes.trxId, 'mr-3')}>
                <a
                  href={
                    (isWrap || isBurned
                      ? process.env.REACT_APP_FIO_BLOCKS_TX_URL
                      : explorerTxUrl) + itemData.transactionId
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {itemData.transactionId}
                </a>
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Date:</b>
              </div>
              <div>
                {blockTimestamp ? formatDateToLocale(blockTimestamp) : null}
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Chain:</b>
              </div>
              <div>{chain}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Block Number:</b>
              </div>
              <div>{blockNumber}</div>
            </div>
            {actionType && (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Action type:</b>
                </div>
                <div>{actionType}</div>
              </div>
            )}
            {amount && (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Amount:</b>
                </div>
                <div>{renderFioPriceFromSuf(amount || 0) + ' FIO'}</div>
              </div>
            )}
            {domain && (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Domain:</b>
                </div>
                <div>{domain}</div>
              </div>
            )}
            {!isBurned && (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>From {isWrap ? 'Account' : 'Address'}:</b>
                </div>
                <div>{from}</div>
              </div>
            )}
            {!isBurned && (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>To {isWrap ? 'Address' : 'Handle'}:</b>
                </div>
                <div>{to}</div>
              </div>
            )}

            {tpid && (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>TPID:</b>
                  </div>
                  <div>{tpid}</div>
                </div>
              </div>
            )}
            {escrowAccount && (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Escrow Account:</b>
                  </div>
                  <div>{escrowAccount}</div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div>
                <b>
                  <h4>Confirmation</h4>
                </b>
              </div>
            </div>

            {voters && voters.length > 0 && (
              <div>
                <div className="d-flex flex-column my-2">
                  <div className="mr-3 mb-2">
                    <b>Voters:</b>
                  </div>
                  <div>
                    {voters.map(voter => (
                      <div
                        className="d-flex flex-row"
                        key={voter.transactionHash}
                      >
                        <div className="d-flex flex-row">
                          <p className="mr-2">Oracle:</p>
                          <a
                            href={voterExplorerAddressUrl + voter.account}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {voter.account?.substring(0, 10)}...
                          </a>
                        </div>
                        <div className="d-flex flex-row ml-4">
                          <p className="mr-2">Trx:</p>
                          <a
                            href={voterExplorerTxUrl + voter.transactionHash}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {voter.transactionHash?.substring(0, 10)}...
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              {approvals?.txId && (
                <>
                  <div className="d-flex justify-content-between my-2">
                    <div className="mr-3">
                      <b>Trx_id:</b>
                    </div>
                    <div className={classes.trxId}>
                      <a
                        href={voterExplorerTxUrl + approvals.txId}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {approvals.txId}
                      </a>
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Chain:</b>
                </div>
                <div>{approvals?.chainCode}</div>
              </div>
              {approvals?.blockNumber && (
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Number:</b>
                  </div>
                  <div>{approvals.blockNumber}</div>
                </div>
              )}
              {approvals?.blockTimeStamp && (
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Time:</b>
                  </div>
                  <div>{formatDateToLocale(approvals.blockTimeStamp)}</div>
                </div>
              )}
              {approvals?.voters && (
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Voters:</b>
                  </div>
                  <div>{JSON.stringify(approvals.voters)}</div>
                </div>
              )}
              {approvals && Object.keys(approvals).includes('isComplete') && (
                <>
                  <div className="d-flex justify-content-between my-2">
                    <div className="mr-3">
                      <b>Is complete:</b>
                    </div>
                    <div>{JSON.stringify(!!approvals.isComplete)}</div>
                  </div>
                </>
              )}
              <CommandComponent commandString={wrapCommand} show={isFailed} />
              {approvals?.txIds && (
                <>
                  <div className="mr-3 mt-3">
                    <b>Approvals:</b>
                  </div>
                  {approvals.txIds.map((txId: AnyType) => (
                    <div key={txId} className={classes.trxId}>
                      <a
                        href={process.env.REACT_APP_FIO_BLOCKS_TX_URL + txId}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {txId}
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div>

            <InfoBadge
              className={classes.infoBadge}
              type={isPending ? BADGE_TYPES.REGULAR : BADGE_TYPES.ERROR}
              show={isPending || isFailed}
              title="Confirmation!"
              message={isPending ? 'Waiting...' : 'Something went wrong.'}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default DetailsModal;
