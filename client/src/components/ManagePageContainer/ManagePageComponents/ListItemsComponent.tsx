import React from 'react';

import InfoBadge from '../../Badges/InfoBadge/InfoBadge';

type Props = {
  isEmpty: boolean;
  emptyStateContent: {
    title: string;
    message: string;
  };
  listItems: React.ReactElement;
};

export const ListItemsComponent: React.FC<Props> = props => {
  const { isEmpty, emptyStateContent, listItems } = props;
  if (isEmpty)
    return (
      <InfoBadge
        title={emptyStateContent.title}
        message={emptyStateContent.message}
      />
    );

  return listItems;
};
