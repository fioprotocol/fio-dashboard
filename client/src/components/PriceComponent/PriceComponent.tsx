import React from 'react';

import Amount from '../common/Amount';
import Loader from '../Loader/Loader';

type Props = {
  costFio: string;
  costUsdc: string;
  isFree?: boolean;
  loading?: boolean;
  loaderComponent?: React.ReactElement;
  isNew?: boolean;
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
    costFio,
    costUsdc,
    isFree,
    loading,
    loaderComponent,
    isNew = false,
  } = props;

  if (isFree) return <span className="boldText">FREE</span>;

  if (isNew) {
    return (
      <>
        <span className="boldText">
          {loading ? (
            <LoaderComponent loaderComponent={loaderComponent} />
          ) : (
            <Amount value={costFio} />
          )}
          &nbsp;FIO
        </span>
        &nbsp;(
        {loading ? (
          <LoaderComponent loaderComponent={loaderComponent} />
        ) : (
          <Amount value={costUsdc} />
        )}
        &nbsp;USDC)
      </>
    );
  } else {
    return (
      <div className="d-flex flex-direction-row">
        <span className="boldText d-flex flex-direction-row">
          $
          {loading ? (
            <LoaderComponent loaderComponent={loaderComponent} />
          ) : (
            <Amount value={costUsdc} />
          )}
        </span>
        &nbsp;
        <span className="d-flex flex-direction-row">
          (
          {loading ? (
            <LoaderComponent loaderComponent={loaderComponent} />
          ) : (
            <Amount value={costFio} />
          )}{' '}
          FIO)
        </span>
      </div>
    );
  }
};
