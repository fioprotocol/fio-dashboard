import React from 'react';
import classnames from 'classnames';

import classes from './DomainStatusBadge.module.scss';

type Props = {
  status: string;
};

const DomainStatusBadge: React.FC<Props> = props => {
  const { status } = props;
  return (
    <div className={classnames(classes.container, classes[status])}>
      {status}
    </div>
  );
};

export default DomainStatusBadge;
