import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import FioDataItemContent from './FioDataItemContent';

import { DETAILED_ITEM_FIELDS } from '../constants';

import { FioDataItemProps, FioDataItemKeysProps } from '../types';

import classes from '../styles/FioDataFieldsList.module.scss';

type Props = {
  fieldsList: FioDataItemKeysProps[];
  fioDataItem: FioDataItemProps;
};

const FioDataFieldsList: React.FC<Props> = props => {
  const { fieldsList, fioDataItem } = props;
  return (
    <div className={classes.fieldsContainer}>
      {fieldsList.map(field => {
        const isShort =
          field === DETAILED_ITEM_FIELDS.type ||
          field === DETAILED_ITEM_FIELDS.date;

        const value = // @ts-ignore
          fioDataItem[field] != null
            ? // @ts-ignore
              fioDataItem[field]
            : // @ts-ignore
              fioDataItem.content[field];

        if (value == null) return null;

        return (
          <div
            className={classnames(classes.container, isShort && classes.short)}
            key={field}
          >
            <Badge show={true} type={BADGE_TYPES.WHITE}>
              <div className={classes.badgeContainer}>
                <p className={classes.title}>{field}</p>
                <p className={classes.content}>
                  <FioDataItemContent
                    value={value}
                    field={field}
                    chain={fioDataItem.content.chain}
                  />
                </p>
              </div>
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default FioDataFieldsList;
