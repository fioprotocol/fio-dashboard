import React from 'react';

import Badge from 'react-bootstrap/Badge';

import classNames from 'classnames';

import Modal from '../../../../components/Modal/Modal';

import { WrapStatusWrapItem } from '../../../../types';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';
import apis from '../../../../api';

import classes from './../WrapStatus.module.scss';

type Props = {
  itemData?: WrapStatusWrapItem;
  onClose: () => void;
  isWrap: boolean;
  isTokens: boolean;
  isComplete: boolean;
};

// todo: refactor
const DetailsModal: React.FC<Props> = props => {
  const { itemData, onClose, isComplete, isWrap, isTokens } = props;

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
          <div>Action Details</div>
          {itemData ? (
            <Badge variant={isComplete ? 'primary' : 'secondary'}>
              {isComplete ? 'Complete' : 'Pending'}
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
                    (itemData.transactionHash
                      ? isTokens
                        ? process.env.REACT_APP_ETH_HISTORY_URL
                        : process.env.REACT_APP_POLYGON_HISTORY_URL
                      : process.env.REACT_APP_FIO_BLOCKS_TX_URL) +
                    (itemData.transactionHash || itemData.transactionId)
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {itemData.transactionHash || itemData.transactionId}
                </a>
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Chain:</b>
              </div>
              <div>{isWrap ? 'FIO' : isTokens ? 'ETH' : 'POLYGON'}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Block Number:</b>
              </div>
              <div>{itemData.blockNumber}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Date:</b>
              </div>
              <div>
                {itemData.data.action_trace?.block_time
                  ? formatDateToLocale(itemData.data.action_trace.block_time)
                  : null}
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>{isWrap ? 'To' : 'From'} Address</b>
              </div>
              <div>{itemData.address}</div>
            </div>
            {itemData.amount ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Amount:</b>
                </div>
                <div>
                  {apis.fio.sufToAmount(itemData.amount || 0).toFixed(2) +
                    ' FIO'}
                </div>
              </div>
            ) : null}
            {itemData.domain ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Domain:</b>
                </div>
                <div>{itemData.domain}</div>
              </div>
            ) : null}
            {itemData.data.action_trace ? (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Action type:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.name}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Receiver:</b>
                  </div>
                  <div>{itemData.data.action_trace.receiver}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Actor:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.data.actor}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>tpid:</b>
                  </div>
                  <div>
                    {JSON.stringify(itemData.data.action_trace.act.data.tpid)}
                  </div>
                </div>
              </div>
            ) : null}

            {!isWrap && itemData.oravotes?.length ? (
              <div className="mt-4">
                <div>
                  <b>
                    <h4>Oracle votes:</h4>
                  </b>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>FIO</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Voters:</b>
                  </div>
                  <div>{JSON.stringify(itemData.oravotes[0].voters)}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Is complete:</b>
                  </div>
                  <div>{JSON.stringify(!!itemData.oravotes[0].isComplete)}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>FIO Address:</b>
                  </div>
                  <div>{itemData.oravotes[0].fio_address}</div>
                </div>
              </div>
            ) : null}

            {isWrap && itemData.confirmData ? (
              <div className="mt-4">
                <div>
                  <b>
                    <h4>Confirm data</h4>
                  </b>
                </div>
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
                        itemData.confirmData.transactionHash
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {itemData.confirmData.transactionHash}
                    </a>
                  </div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.data.chain_code}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Number:</b>
                  </div>
                  <div>{itemData.confirmData.blockNumber}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Event name:</b>
                  </div>
                  <div>{itemData.confirmData.event}</div>
                </div>
              </div>
            ) : null}

            {!isWrap && itemData.confirmData?.length ? (
              <div className="mt-4">
                <div>
                  <b>
                    <h4>Confirm data</h4>
                  </b>
                </div>
                <div className="my-2">
                  <div className="mr-3">
                    <b>Transactions ids:</b>
                  </div>
                  {itemData.confirmData.map((item: any) => (
                    <div
                      key={item.action_trace.trx_id}
                      className={classes.trxId}
                    >
                      <a
                        href={
                          process.env.REACT_APP_FIO_BLOCKS_TX_URL +
                          item.action_trace.trx_id
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.action_trace.trx_id}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default DetailsModal;
