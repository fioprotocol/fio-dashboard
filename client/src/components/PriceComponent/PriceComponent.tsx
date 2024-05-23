import React from 'react';

import classnames from 'classnames';

import Amount from '../common/Amount';
import Loader from '../Loader/Loader';
import { FIO_CHAIN_CODE } from '../../constants/fio';

type Props = {
  className?: string;
  costFio: string;
  costUsdc?: string;
  tokenCode?: string;
  isFree?: boolean;
  loading?: boolean;
  loaderComponent?: React.ReactElement;
};

const LoaderComponent = ({
  loaderComponent,
}: {
  loaderComponent?: React.ReactElement;
}) => (
  <span className="d-flex flex-direction-row">
    {loaderComponent || <Loader />}&nbsp;
  </span>
);

export const PriceComponent: React.FC<Props> = props => {
  const {
    className,
    costFio,
    costUsdc,
    tokenCode = FIO_CHAIN_CODE,
    isFree,
    loading,
    loaderComponent,
  } = props;

  if (isFree) return <span className="boldText">FREE</span>;

  return (
    <span className={classnames('d-flex flex-direction-row', className)}>
      {costUsdc && (
        <>
          <span className="boldText d-flex flex-direction-row">
            $
            {loading ? (
              <LoaderComponent loaderComponent={loaderComponent} />
            ) : (
              <Amount value={costUsdc} />
            )}
          </span>
          &nbsp;
        </>
      )}
      <span className="d-flex flex-direction-row">
        (
        {loading ? (
          <LoaderComponent loaderComponent={loaderComponent} />
        ) : (
          <Amount value={costFio} />
        )}{' '}
        {tokenCode})
      </span>
    </span>
  );
};
