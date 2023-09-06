import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import Loader from '../../components/Loader/Loader';

import classes from './InfiniteScroll.module.scss';

type Props = {
  loading: boolean;
  hasNextPage: boolean;
  hasReverseLoading?: boolean;
  onLoadMore: () => void;
  maxHeight?: number;
};

const InfiniteScroll: React.FC<Props> = props => {
  const {
    loading,
    hasNextPage,
    hasReverseLoading,
    children,
    onLoadMore,
    ...rest
  } = props;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    rootMargin: '0px 0px 20px 0px',
    ...rest,
  });

  return (
    <div className={classes.container}>
      {hasReverseLoading && (
        <div className={classes.loader} ref={sentryRef}>
          <Loader className={classes.loaderIcon} />
        </div>
      )}
      {children}
      {(loading || hasNextPage) && !hasReverseLoading && (
        <div className={classes.loader} ref={sentryRef}>
          <Loader className={classes.loaderIcon} />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
