import React from 'react';

import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import classes from './UserInfo.module.scss';

type Props = {
  affiliateProfile: { code?: string };
  createdAt: string;
  refProfile: { code?: string };
  status: string;
  timeZone: string;
  userProfileType: string;
};

export const UserInfo: React.FC<Props> = props => {
  const {
    affiliateProfile,
    createdAt,
    refProfile,
    status,
    timeZone,
    userProfileType,
  } = props;

  const userInfoData: { title: string; value: string }[] = [
    {
      title: 'Created',
      value: formatDateToLocale(createdAt),
    },
    {
      title: 'Type',
      value: userProfileType,
    },
    {
      title: 'Status',
      value: status,
    },
    {
      title: 'Ref Profile',
      value: refProfile?.code || 'No Ref Profile',
    },
    {
      title: 'Affiliate Profile',
      value: affiliateProfile?.code || 'No affiliate code',
    },
    {
      title: 'Time Zone',
      value: timeZone,
    },
  ];

  return (
    <div className={classes.info}>
      {userInfoData.map(({ title, value }) => (
        <div className={classes.infoItem} key={title}>
          <h5 className={classes.title}>{title}</h5>
          <p className={classes.value}>{value}</p>
        </div>
      ))}
    </div>
  );
};
