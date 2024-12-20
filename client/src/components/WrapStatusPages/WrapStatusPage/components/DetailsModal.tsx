import React from 'react';

import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';

import { FIOSDK } from '@fioprotocol/fiosdk';

import Modal from '../../../../components/Modal/Modal';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import { CommandComponent } from './CommandComponent';

import { BADGE_TYPES } from '../../../Badge/Badge';
import { WRAP_ITEM_STATUS } from '../../../../constants/wrap';
import { WRAP_STATUS_CONTENT } from '../constants';

import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import { AnyType, WrapStatusWrapItem } from '../../../../types';

import classes from './../WrapStatus.module.scss';

type Props = {
  itemData?: WrapStatusWrapItem;
  onClose: () => void;
  isWrap: boolean;
  isTokens: boolean;
  isBurned: boolean;
};

const DetailsModal: React.FC<Props> = props => {
  const { itemData, onClose, isWrap, isTokens, isBurned } = props;

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
    status,
    to,
    tpid,
    transactionId,
    voters,
  } = itemData || {};

  const isPending = status === WRAP_ITEM_STATUS.PENDING;
  const isFailed = status === WRAP_ITEM_STATUS.FAILED;

  const obtid = voters?.length
    ? voters[0].obtid || transactionId
    : transactionId;

  const wrapTokenFailedCommand = `npm run oracle wrap tokens ${amount} ${to} ${obtid}`;
  const wrapDomainFailedCommand = `npm run oracle wrap domain ${domain} ${to} ${obtid}`;
  const unwrapTokenFailedCommand = `npm run oracle unwrap tokens ${amount} ${to} ${obtid}`;
  const unwrapDomainFailedCommand = `npm run oracle unwrap domain ${domain} ${to} ${obtid}`;
  const burnDomainFailedCommand = `npm run oracle burn domain ${domain} ${obtid}`;

  const wrapCommand = isWrap
    ? isTokens
      ? wrapTokenFailedCommand
      : wrapDomainFailedCommand
    : isTokens
    ? unwrapTokenFailedCommand
    : isBurned
    ? burnDomainFailedCommand
    : unwrapDomainFailedCommand;

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
          <div>
            {isWrap ? 'Wrap ' : isBurned ? 'Burn ' : 'Unwrap '}
            {isTokens ? `${isWrap ? '' : 'w'}FIO` : 'FIO Domain'}
          </div>
          {itemData ? (
            <Badge variant={WRAP_STATUS_CONTENT[itemData.status].type}>
              {WRAP_STATUS_CONTENT[itemData.status].text}
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
                      : isTokens
                      ? process.env.REACT_APP_ETH_HISTORY_URL
                      : process.env.REACT_APP_POLYGON_HISTORY_URL) +
                    itemData.transactionId
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
                <div>{FIOSDK.SUFToAmount(amount || 0).toFixed(2) + ' FIO'}</div>
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
                      <div className="d-flex flex-row" key={voter.account}>
                        <div className="d-flex flex-row">
                          <p className="mr-2">Oracle:</p>
                          <a
                            href={
                              (isTokens
                                ? process.env.REACT_APP_ETH_ADDRESS_URL
                                : process.env.REACT_APP_POLYGON_ADDRESS_URL) +
                              voter.account
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {voter.account?.substring(0, 10)}...
                          </a>
                        </div>
                        <div className="d-flex flex-row ml-4">
                          <p className="mr-2">Trx:</p>
                          <a
                            href={
                              (isTokens
                                ? process.env.REACT_APP_ETH_HISTORY_URL
                                : process.env.REACT_APP_POLYGON_HISTORY_URL) +
                              voter.transactionHash
                            }
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
              {approvals.txId && (
                <>
                  <div className="d-flex justify-content-between my-2">
                    <div className="mr-3">
                      <b>Trx_id:</b>
                    </div>
                    <div className={classes.trxId}>
                      <a
                        href={
                          (isTokens
                            ? process.env.REACT_APP_ETH_HISTORY_URL
                            : process.env.REACT_APP_POLYGON_HISTORY_URL) +
                          approvals.txId
                        }
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
                <div>{approvals.chainCode}</div>
              </div>
              {approvals.blockNumber && (
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Number:</b>
                  </div>
                  <div>{approvals.blockNumber}</div>
                </div>
              )}
              {approvals.blockTimeStamp && (
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
              {Object.keys(approvals).includes('isComplete') && (
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
              {approvals.txIds && (
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
