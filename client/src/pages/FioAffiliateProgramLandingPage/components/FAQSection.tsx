import React, { useContext } from 'react';
import {
  Accordion,
  AccordionContext,
  AccordionToggleProps,
  useAccordionToggle,
} from 'react-bootstrap';
import classnames from 'classnames';
import AddIcon from '@mui/icons-material/Add';

import { LinksSection } from './LinksSection';

import { CommonComponentProps } from '../types';

import classes from '../styles/FAQSection.module.scss';

const accordionContent = [
  {
    title: 'How much can I earn?',
    subtitle:
      'Please Note: Payouts are only made on the first year of new domain registration, even if registration is made for multiple years.',
    text:
      'The cost of FIO Domains vary, but is typically around $40 for 1 year. The percentage of payout will remain at 50% until New User Bounty token pool is depleted, at which point it will be reduced to 10%.',
  },
  {
    title: 'How will I receive the payment?',
    text:
      'Payments are automatically processed by the FIO Chain in FIO Tokens and are sent to the FIO Handle provided, once minimum of 100 FIO Tokens have been accrued.',
  },
  {
    title: 'How will I know if someone has purchased a FIO Domain?',
    text:
      'Individual FIO Domain purchases are not shown in the FIO App, but once you receive a payment you will see it in the FIO Token section.',
  },
  {
    title: 'Will I be paid if someone renews a FIO Domain?',
    text:
      'No, the Affiliate Program only pays for the initial FIO Domain registration.',
  },
];

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
      <AddIcon
        onClick={decoratedOnClick}
        className={classnames(
          classes.titleIcon,
          isActive && classes.isActiveIcon,
        )}
      />
    </div>
  );
};

export const FAQSection: React.FC<CommonComponentProps> = props => {
  const {
    isAuthenticated,
    isAffiliateEnabled,
    showLogin,
    showAffiliateModal,
  } = props;

  return (
    <section
      className={classnames(
        classes.container,
        classes.containerLayout,
        classes.sectionLayout,
      )}
    >
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
              <>
                {accordionItem.subtitle && (
                  <p
                    className={classes.accordionItemSubtitle}
                    dangerouslySetInnerHTML={{ __html: accordionItem.subtitle }}
                  />
                )}
                <div
                  className={classes.accordionItemText}
                  dangerouslySetInnerHTML={{ __html: accordionItem.text }}
                />
              </>
            </Accordion.Collapse>
          </div>
        ))}
      </Accordion>
      <LinksSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        faqInfoPosition="above"
        title="Get Your Link Now"
        showSubtitle
        showLogin={showLogin}
        showAffiliateModal={showAffiliateModal}
      />
    </section>
  );
};
