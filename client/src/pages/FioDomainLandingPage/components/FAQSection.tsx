import React, { useContext } from 'react';
import {
  Accordion,
  AccordionContext,
  AccordionToggleProps,
  useAccordionToggle,
} from 'react-bootstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FioDomainWidget } from '../../../components/FioDomainWidget';

import { FormValues } from '../../../components/FioDomainWidget/types';

import classes from '../styles/FAQSection.module.scss';

const accordionContent = [
  {
    title: 'What is a FIO Domain?',
    text:
      'A FIO domain is part of a human-readable crypto handle which consists of a username and a domain. Both usernames and domains are separate NFTs (non-fungible tokens) which are paired together to the crypto handle which create a substitute for long public blockchain addresses.',
  },
  {
    title: 'Do I need a FIO domain to interact with the FIO protocol?',
    text:
      'While having a FIO Crypto Handle is necessary to use the FIO Protocol, users do not need to own their own FIO Domain. By default, many applications (especially wallets and exchanges) have a domain available as a default for their users. Users which desire their own unique FIO domain may register one that is available as a non-fungible token that they control and own.',
  },
  {
    title: 'Am I obligate to use a specific domain?',
    text:
      'Outside of centralized services (which own all user private keys, including FIO Crypto Handles), users are not obligated to use a specific domain for their FIO Crypto Handle, regardless of the wallet they choose to use.',
  },
  {
    title: 'Is a FIO Domain Public or Private?',
    text:
      'By default, a FIO Domain is private and can only be used for a FIO Crypto Handle registration from the domain owner themselves. However, If chosen, the domain owner can change their domain to public, which would allow anyone with a FIO private key to register a FIO Crypto Handle on their domain.',
  },
  {
    title:
      'Are FIO domains similar to Ethereum Name Service or Unstoppable domains?',
    text:
      'When compared to other naming services such as Ethereum Name Service and Unstoppable Domains, FIO distinguishes itself by being more than just a wallet naming service. In addition to wallet naming, it offers payment request & send functionality, encrypted payment data, and NFT signatures.',
  },
];

type Props = {
  onSubmit: (values: FormValues) => void;
};

const CustomToggle = ({
  children,
  eventKey,
  onClick,
}: AccordionToggleProps) => {
  const activeEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, onClick);

  const isActive = activeEventKey === eventKey;

  return (
    <div className={classes.accordionItemTitleContainer}>
      <h5
        className={classnames(
          classes.accordionItemTitle,
          isActive && classes.isActive,
        )}
        onClick={decoratedOnClick}
      >
        {children}
      </h5>
      <FontAwesomeIcon
        icon="plus"
        className={classnames(
          classes.titleIcon,
          isActive && classes.isActiveIcon,
        )}
        onClick={decoratedOnClick}
      />
    </div>
  );
};

const FAQSection: React.FC<Props> = props => {
  const { onSubmit } = props;

  return (
    <section className={classnames(classes.container, classes.sectionLayout)}>
      <h1 className={classnames(classes.title, 'boldText')}>
        Frequently Asked Questions
      </h1>
      <Accordion defaultActiveKey="0" className={classes.accordion}>
        {accordionContent.map((accordionItem, i) => (
          <div key={accordionItem.title} className={classes.accordionItem}>
            <CustomToggle eventKey={i.toString()}>
              {accordionItem.title}
            </CustomToggle>
            <Accordion.Collapse eventKey={i.toString()}>
              <div className={classes.accordionItemText}>
                {accordionItem.text}
              </div>
            </Accordion.Collapse>
          </div>
        ))}
      </Accordion>
      <FioDomainWidget
        withoutBackground={true}
        withoutBottomMargin={true}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default FAQSection;
