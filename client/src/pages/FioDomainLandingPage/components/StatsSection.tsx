import React from 'react';
import CountUp from 'react-countup';
import classnames from 'classnames';

import classes from '../styles/StatsSection.module.scss';

const contentItems = [
  {
    text: 'FIO Crypto Handles & Domains',
    amount: 850000,
  },
  {
    text: 'Integration Partners',
    amount: 100,
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className={classnames(classes.container, classes.sectionLayout)}>
      <div className={classes.contentContainer}>
        {contentItems.map(contentItem => (
          <div className={classes.contentItem} key={contentItem.text}>
            <h1 className={classnames(classes.contentItemAmount, 'boldText')}>
              <CountUp
                end={contentItem.amount}
                separator=","
                suffix="+"
                delay={500}
                enableScrollSpy={true}
              />
            </h1>
            <div className={classes.contentItemText}>{contentItem.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
