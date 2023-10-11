import React from 'react';
import { Link } from 'react-router-dom';
import { Element } from 'react-scroll';

import { AnchorComponent } from '../../components/AnchorComponent';
import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import { ROUTES } from '../../constants/routes';

import classes from './PrivacyPolicyPage.module.scss';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <LayoutContainer title="Privacy Policy">
      <h4 className={classes.header} id="INTRODUCTION">
        <strong>INTRODUCTION</strong>
      </h4>
      <p>
        This privacy notice for&nbsp;FIO (BVI), Ltd&nbsp;("<strong>FIO</strong>
        ," "<strong>we</strong>," "<strong>us</strong>," or "
        <strong>our</strong>"), describes how and why we might collect, store,
        use, and/or share ("<strong>process</strong>") your information when you
        use our services ("<strong>Services</strong>"), such as when you:
      </p>
      <ul>
        <li>
          <p>
            Visit our website&nbsp;at&nbsp;
            <a href="/" title={process.env.REACT_APP_BASE_URL}>
              {process.env.REACT_APP_BASE_URL?.slice(0, -1)}
            </a>
            , or any website of ours that links to this privacy notice
          </p>
        </li>
        <li>
          <p>
            Engage with us in other related ways, including any sales,
            marketing, or events
          </p>
        </li>
      </ul>
      <p>
        <strong>Questions or concerns?&nbsp;</strong>Reading this privacy notice
        will help you understand your privacy rights and choices. If you do not
        agree with our policies and practices, please do not use our Services.If
        you still have any questions or concerns, please contact us by{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          submitting a support ticket
        </a>
        .
      </p>
      <h4 id="SUMMARY-OF-KEY-POINTS">
        <strong>SUMMARY OF KEY POINTS</strong>
      </h4>
      <p>
        <em>
          <strong>
            This summary provides key points from our privacy notice, but you
            can find out more details about any of these topics by clicking the
            link following each key point or by using our{' '}
          </strong>
        </em>
        <AnchorComponent to="PrivacyPolicy-0" title="#0">
          <em>
            <strong>table of contents</strong>
          </em>
        </AnchorComponent>
        <em>
          <strong> below to find the section you are looking for.</strong>
        </em>
      </p>
      <p>
        <strong>What personal information do we process?</strong>&nbsp;When you
        visit, use, or navigate our Services, we may process personal
        information depending on how you interact with&nbsp;FIO (BVI),
        Ltd&nbsp;and the Services, the choices you make, and the products and
        features you use. Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-1" title="#1">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        <strong>Do we process any sensitive personal information?</strong>
        &nbsp;We do not process sensitive personal information.
      </p>
      <p>
        <strong>Do we receive any information from third parties?</strong>
        &nbsp;We do not receive any information from third parties.
      </p>
      <p>
        <strong>How do we process your information?</strong>&nbsp;We process
        your information to provide, improve, and administer our Services,
        communicate with you, for security and fraud prevention, and to comply
        with law. We may also process your information for other purposes with
        your consent. We process your information only when we have a valid
        legal reason to do so. Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-2" title="#2">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        <strong>
          In what situations and with which&nbsp;types of&nbsp;parties do we
          share personal information?
        </strong>
        &nbsp;We may share information in specific situations and with
        specific&nbsp;categories of&nbsp;third parties. Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-4" title="#4">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        <strong>How do we keep your information safe?</strong>&nbsp;We
        have&nbsp;organizational&nbsp;and technical processes and procedures in
        place to protect your personal information. However, no electronic
        transmission over the internet or information storage technology can be
        guaranteed to be 100% secure, so we cannot promise or guarantee that
        hackers, cybercriminals, or other&nbsp;unauthorized&nbsp;third parties
        will not be able to defeat our security and improperly collect, access,
        steal, or modify your information. Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-8" title="#8">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        <strong>What are your rights?</strong>&nbsp;Depending on where you are
        located geographically, the applicable privacy law may mean you have
        certain rights regarding your personal information. Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-10" title="#10">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        <strong>How do you exercise your rights?</strong>&nbsp;The easiest way
        to exercise your rights is by by{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          contacting us
        </a>
        . We will consider and act upon any request in accordance with
        applicable data protection laws.
      </p>
      <p>
        Want to learn more about what&nbsp;FIO (BVI), Ltd&nbsp;does with any
        information we collect? Review the notice in full below.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-0">
        <strong>0. TABLE OF CONTENTS</strong>
      </h4>
      <div>
        <div>
          <div>
            <div>
              <ul>
                <li>
                  <AnchorComponent to="INTRODUCTION">
                    PRIVACY POLICY
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="INTRODUCTION">
                    INTRODUCTION
                  </AnchorComponent>
                  <ul>
                    <li>
                      <AnchorComponent to="SUMMARY-OF-KEY-POINTS">
                        SUMMARY OF KEY POINTS
                      </AnchorComponent>
                    </li>
                  </ul>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-0">
                    0. TABLE OF CONTENTS
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-1">
                    1. WHAT INFORMATION DO WE COLLECT?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-2">
                    2. HOW DO WE PROCESS YOUR INFORMATION?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-3">
                    3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR
                    INFORMATION?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-4">
                    4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-5">
                    5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-6">
                    6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-7">
                    7. HOW LONG DO WE KEEP YOUR INFORMATION?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-8">
                    8. HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-9">
                    9. DO WE COLLECT INFORMATION FROM MINORS?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-10">
                    10. WHAT ARE YOUR PRIVACY RIGHTS?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-11">
                    11. CONTROLS FOR DO-NOT-TRACK FEATURES
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-12">
                    12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-13">
                    13. DO WE MAKE UPDATES TO THIS NOTICE?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-14">
                    14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </AnchorComponent>
                </li>
                <li>
                  <AnchorComponent to="PrivacyPolicy-15">
                    15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE
                    COLLECT FROM YOU?
                  </AnchorComponent>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h4 className={classes.header} id="PrivacyPolicy-1">
        <Element name="PrivacyPolicy-1">
          <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
        </Element>
      </h4>
      <p>
        <strong>Personal information you disclose to us.</strong>
      </p>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We collect personal information that
          you provide to us.
        </em>
      </p>
      <p>
        We collect personal information that you voluntarily provide to us when
        you&nbsp;register on the Services,&nbsp;express an interest in obtaining
        information about us or our products and Services, when you participate
        in activities on the Services, or otherwise when you contact us.
      </p>
      <p>
        <strong>Personal Information Provided by You.</strong>&nbsp;The personal
        information that we collect depends on the context of your interactions
        with us and the Services, the choices you make, and the products and
        features you use. The personal information we collect may include the
        following:
      </p>
      <ul>
        <li>
          <p>email addresses</p>
        </li>
        <li>
          <p>secret questions/answers</p>
        </li>
        <li>
          <p>blockchain public addresses</p>
        </li>
        <li>
          <p>debit/credit card numbers</p>
        </li>
        <li>
          <p>names</p>
        </li>
        <li>
          <p>billing addresses</p>
        </li>
      </ul>
      <p>
        <strong>Sensitive Information.</strong>&nbsp;We do not process sensitive
        information.
      </p>
      <p>
        <strong>Payment Data.</strong>&nbsp;We may collect data necessary to
        process your payment if you make purchases, such as your payment
        instrument number (such as a credit card number), and the security code
        associated with your payment instrument. All payment data is stored
        by&nbsp;Stripe. You may find their privacy notice link(s) here:&nbsp;
        <a
          href="https://stripe.com/privacy"
          title="https://stripe.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          https://stripe.com/privacy
        </a>{' '}
        .
      </p>
      <p>
        All personal information that you provide to us must be true, complete,
        and accurate, and you must notify us of any changes to such personal
        information.
      </p>
      <p>
        <strong>Information automatically collected</strong>
      </p>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>Some information — such as your
          Internet Protocol (IP) address and/or browser and device
          characteristics — is collected automatically when you visit our
          Services.
        </em>
      </p>
      <p>
        We automatically collect certain information when you visit, use, or
        navigate the Services. This information does not reveal your specific
        identity (like your name or contact information) but may include device
        and usage information, such as your IP address, browser and device
        characteristics, operating system, language preferences, referring URLs,
        device name, country, location, information about how and when you use
        our Services, and other technical information. This information is
        primarily needed to maintain the security and operation of our Services,
        and for our internal analytics and reporting purposes.
      </p>
      <p>
        Like many businesses, we also collect information through cookies and
        similar technologies.
      </p>
      <p>The information we collect includes:</p>
      <ul>
        <li>
          <p>
            <em>Log and Usage Data.</em>&nbsp;Log and usage data is
            service-related, diagnostic, usage, and performance information our
            servers automatically collect when you access or use our Services
            and which we record in log files. Depending on how you interact with
            us, this log data may include your IP address, device information,
            browser type, and settings and information about your activity in
            the Services&nbsp;(such as the date/time stamps associated with your
            usage, pages and files viewed, searches, and other actions you take
            such as which features you use), device event information (such as
            system activity, error reports (sometimes called&nbsp;"crash
            dumps"), and hardware settings).
          </p>
        </li>
        <li>
          <p>
            <em>Device Data.</em>&nbsp;We collect device data such as
            information about your computer, phone, tablet, or other device you
            use to access the Services. Depending on the device used, this
            device data may include information such as your IP address (or
            proxy server), device and application identification numbers,
            location, browser type, hardware model, Internet service provider
            and/or mobile carrier, operating system, and system configuration
            information.
          </p>
        </li>
        <li>
          <p>
            <em>Location Data.</em>&nbsp;We collect location data such as
            information about your device's location, which can be either
            precise or imprecise. How much information we collect depends on the
            type and settings of the device you use to access the Services. For
            example, we may use GPS and other technologies to collect
            geolocation data that tells us your current location (based on your
            IP address). You can opt out of allowing us to collect this
            information either by refusing access to the information or by
            disabling your Location setting on your device. However, if you
            choose to opt out, you may not be able to use certain aspects of the
            Services.
          </p>
        </li>
      </ul>
      <h4 className={classes.header} id="PrivacyPolicy-2">
        <strong>2. HOW DO WE PROCESS YOUR INFORMATION?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We process your information to
          provide, improve, and administer our Services, communicate with you,
          for security and fraud prevention, and to comply with law. We may also
          process your information for other purposes with your consent.
        </em>
      </p>
      <p>
        <strong>
          We process your personal information for a variety of reasons,
          depending on how you interact with our Services, including:
        </strong>
      </p>
      <ul>
        <li>
          <p>
            <strong>
              To facilitate account creation and authentication and otherwise
              manage user accounts.&nbsp;
            </strong>
            We may process your information so you can create and log in to your
            account, as well as keep your account in working order.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>To request feedback.&nbsp;</strong>We may process your
            information when necessary to request feedback and to contact you
            about your use of our Services.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>To protect our Services.</strong>&nbsp;We may process your
            information as part of our efforts to keep our Services safe and
            secure, including fraud monitoring and prevention.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>To identify usage trends.</strong>&nbsp;We may process
            information about how you use our Services to better understand how
            they are being used so we can improve them.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>
              To determine the effectiveness of our marketing and promotional
              campaigns.
            </strong>
            &nbsp;We may process your information to better understand how to
            provide marketing and promotional campaigns that are most relevant
            to you.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>To save or protect an individual's vital interest.</strong>
            &nbsp;We may process your information when necessary to save or
            protect an individual’s vital interest, such as to prevent harm.
          </p>
        </li>
      </ul>
      <h4 className={classes.header} id="PrivacyPolicy-3">
        <strong>
          3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
        </strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We only process your personal
          information when we believe it is necessary and we have a valid legal
          reason (i.e.,&nbsp;legal basis) to do so under applicable law, like
          with your consent, to comply with laws, to provide you with services
          to enter into or&nbsp;fulfill&nbsp;our contractual obligations, to
          protect your rights, or to&nbsp;fulfill&nbsp;our legitimate business
          interests.
        </em>
      </p>
      <p>
        <em>
          <strong>
            <u>
              If you are located in the EU or UK, this section applies to you.
            </u>
          </strong>
        </em>
      </p>
      <p>
        The General Data Protection Regulation (GDPR) and UK GDPR require us to
        explain the valid legal bases we rely on in order to process your
        personal information. As such, we may rely on the following legal bases
        to process your personal information:
      </p>
      <ul>
        <li>
          <p>
            <strong>Consent.&nbsp;</strong>We may process your information if
            you have given us permission (i.e.,&nbsp;consent) to use your
            personal information for a specific purpose. You can withdraw your
            consent at any time. Click&nbsp;
            <AnchorComponent to="PrivacyPolicy-10" title="#10">
              here
            </AnchorComponent>
            &nbsp;to learn more.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>Legitimate Interests.</strong>&nbsp;We may process your
            information when we believe it is reasonably necessary to achieve
            our legitimate business interests and those interests do not
            outweigh your interests and fundamental rights and freedoms. For
            example, we may process your personal information for some of the
            purposes described in order to:
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            Analyze&nbsp;how our services are used so we can improve them to
            engage and retain users
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Support our marketing activities</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Diagnose problems and/or prevent fraudulent activities</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            Understand how our users use our products and services so we can
            improve user experience
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>Legal Obligations.</strong>&nbsp;We may process your
            information where we believe it is necessary for compliance with our
            legal obligations, such as to cooperate with a law enforcement body
            or regulatory agency, exercise or defend our legal rights, or
            disclose your information as evidence in litigation in which we are
            involved.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            <strong>Vital Interests.</strong>&nbsp;We may process your
            information where we believe it is necessary to protect your vital
            interests or the vital interests of a third party, such as
            situations involving potential threats to the safety of any person.
          </p>
        </li>
      </ul>
      <p>
        <em>
          <strong>
            <u>If you are located in Canada, this section applies to you.</u>
          </strong>
        </em>
      </p>
      <p>
        We may process your information if you have given us specific permission
        (i.e.,&nbsp;express consent) to use your personal information for a
        specific purpose, or in situations where your permission can be inferred
        (i.e.,&nbsp;implied consent). You can withdraw your consent at any time.
        Click&nbsp;
        <AnchorComponent to="PrivacyPolicy-10" title="#10">
          here
        </AnchorComponent>
        &nbsp;to learn more.
      </p>
      <p>
        In some exceptional cases, we may be legally permitted under applicable
        law to process your information without your consent, including, for
        example:
      </p>
      <ul>
        <li>
          <p>
            If collection is clearly in the interests of an individual and
            consent cannot be obtained in a timely way
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>For investigations and fraud detection and prevention</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>For business transactions provided certain conditions are met</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If it is contained in a witness statement and the collection is
            necessary to assess, process, or settle an insurance claim
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            For identifying injured, ill, or deceased persons and communicating
            with next of kin
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If we have reasonable grounds to believe an individual has been, is,
            or may be victim of financial abuse
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If it is reasonable to expect collection and use with consent would
            compromise the availability or the accuracy of the information and
            the collection is reasonable for purposes related to investigating a
            breach of an agreement or a contravention of the laws of Canada or a
            province
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If disclosure is required to comply with a subpoena, warrant, court
            order, or rules of the court relating to the production of records
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If it was produced by an individual in the course of their
            employment, business, or profession and the collection is consistent
            with the purposes for which the information was produced
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If the collection is solely for journalistic, artistic, or literary
            purposes
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            If the information is publicly available and is specified by the
            regulations
          </p>
        </li>
      </ul>
      <h4 className={classes.header} id="PrivacyPolicy-4">
        <strong>
          4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </strong>
      </h4>
      <p>
        <em>
          <strong>In Short:</strong>&nbsp;We may share information in specific
          situations described in this section and/or with the
          following&nbsp;categories of&nbsp;third parties.
        </em>
      </p>
      <p>
        <strong>
          Vendors, Consultants, and Other Third-Party Service Providers.
        </strong>
        &nbsp;We may share your data with third-party vendors, service
        providers, contractors, or agents ("<strong>third parties</strong>") who
        perform services for us or on our behalf and require access to such
        information to do that work.&nbsp;We have contracts in place with our
        third parties, which are designed to help safeguard your personal
        information. This means that they cannot do anything with your personal
        information unless we have instructed them to do it. They will also not
        share your personal information with any&nbsp;organization&nbsp;apart
        from us. They also commit to protect the data they hold on our behalf
        and to retain it for the period we instruct.&nbsp;The&nbsp;categories
        of&nbsp;third parties we may share personal information with are as
        follows:
      </p>
      <ul>
        <li>
          <p>Finance &amp; Accounting Tools</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Order&nbsp;Fulfillment&nbsp;Service Providers</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Payment Processors</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Website Hosting Service Providers</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Data Analytics Services</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>User Account Registration &amp; Authentication Services</p>
        </li>
      </ul>
      <h4 className={classes.header} id="PrivacyPolicy-5">
        <strong>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:</strong>&nbsp;We may use cookies and other tracking
          technologies to collect and store your information.
        </em>
      </p>
      <p>
        We may use cookies and similar tracking technologies (like web beacons
        and pixels) to access or store information. Specific information about
        how we use such technologies and how you can refuse certain cookies is
        set out in our{' '}
        <Link to={ROUTES.COOKIE_NOTICE} title="cookie-notice">
          Cookie Notice
        </Link>
        .
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-6">
        <strong>6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We may transfer, store, and process
          your information in countries other than your own.
        </em>
      </p>
      <p>
        Our servers are located in&nbsp;the&nbsp;United States. If you are
        accessing our Services from outside&nbsp;the&nbsp;United States, please
        be aware that your information may be transferred to, stored, and
        processed by us in our facilities and by those third parties with whom
        we may share your personal information (see&nbsp;"
        <AnchorComponent to="PrivacyPolicy-4" title="#4">
          WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </AnchorComponent>
        "&nbsp;above), in&nbsp;the&nbsp;United States,&nbsp;and other countries.
      </p>
      <p>
        If you are a resident in the European Economic Area (EEA) or United
        Kingdom (UK), then these countries may not necessarily have data
        protection laws or other similar laws as comprehensive as those in your
        country. However, we will take all necessary measures to protect your
        personal information in accordance with this privacy notice and
        applicable law.
      </p>
      <p>European Commission's Standard Contractual Clauses:</p>
      <p>
        We have implemented measures to protect your personal information,
        including by using the European Commission's Standard Contractual
        Clauses for transfers of personal information between our group
        companies and between us and our third-party providers. These clauses
        require all recipients to protect all personal information that they
        process originating from the EEA or UK in accordance with European data
        protection laws and regulations.&nbsp;Our Standard Contractual Clauses
        can be provided upon request.&nbsp;We have implemented similar
        appropriate safeguards with our third-party service providers and
        partners and further details can be provided upon request.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-7">
        <strong>7. HOW LONG DO WE KEEP YOUR INFORMATION?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We keep your information for as long
          as necessary to&nbsp;fulfill&nbsp;the purposes outlined in this
          privacy notice unless otherwise required by law.
        </em>
      </p>
      <p>
        We will only keep your personal information for as long as it is
        necessary for the purposes set out in this privacy notice, unless a
        longer retention period is required or permitted by law (such as tax,
        accounting, or other legal requirements). No purpose in this notice will
        require us keeping your personal information for longer than&nbsp;the
        period of time in which users have an account with us.
      </p>
      <p>
        When we have no ongoing legitimate business need to process your
        personal information, we will either delete or&nbsp;anonymize&nbsp;such
        information, or, if this is not possible (for example, because your
        personal information has been stored in backup archives), then we will
        securely store your personal information and isolate it from any further
        processing until deletion is possible.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-8">
        <strong>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>We aim to protect your personal
          information through a system of&nbsp;organizational&nbsp;and technical
          security measures.
        </em>
      </p>
      <p>
        We have implemented appropriate and reasonable technical
        and&nbsp;organizational&nbsp;security measures designed to protect the
        security of any personal information we process. However, despite our
        safeguards and efforts to secure your information, no electronic
        transmission over the Internet or information storage technology can be
        guaranteed to be 100% secure, so we cannot promise or guarantee that
        hackers, cybercriminals, or other&nbsp;unauthorized&nbsp;third parties
        will not be able to defeat our security and improperly collect, access,
        steal, or modify your information. Although we will do our best to
        protect your personal information, transmission of personal information
        to and from our Services is at your own risk. You should only access the
        Services within a secure environment.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-9">
        <strong>9. DO WE COLLECT INFORMATION FROM MINORS?</strong>
      </h4>
      <p>
        We do not knowingly solicit data from or market to children under 18
        years of age. By using the Services, you represent that you are at least
        18 or that you are the parent or guardian of such a minor and consent to
        such minor dependent’s use of the Services. If we learn that personal
        information from users less than 18 years of age has been collected, we
        will deactivate the account and take reasonable measures to promptly
        delete such data from our records. If you become aware of any data we
        may have collected from children under age 18, please contact us by{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          submitting a support ticket
        </a>
        .
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-10">
        <strong>10. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:</strong>&nbsp;In some regions, such as&nbsp;the
          European Economic Area (EEA), United Kingdom (UK), and Canada, you
          have rights that allow you greater access to and control over your
          personal information.&nbsp;You may review, change, or terminate your
          account at any time.
        </em>
      </p>
      <p>
        In some regions (like&nbsp;the EEA, UK, and Canada), you have certain
        rights under applicable data protection laws. These may include the
        right (i) to request access and obtain a copy of your personal
        information, (ii) to request rectification or erasure; (iii) to restrict
        the processing of your personal information; and (iv) if applicable, to
        data portability. In certain circumstances, you may also have the right
        to object to the processing of your personal information. You can make
        such a request by contacting us by using the contact details provided in
        the section&nbsp;"
        <AnchorComponent to="PrivacyPolicy-14" title="#14">
          HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </AnchorComponent>
        "&nbsp;below.
      </p>
      <p>
        We will consider and act upon any request in accordance with applicable
        data protection laws.&nbsp;
      </p>
      <p>
        If you are located in the EEA or UK and you believe we are unlawfully
        processing your personal information, you also have the right to
        complain to your local data protection supervisory authority. You can
        find their contact details here:&nbsp;
        <a
          href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
          title="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
          target="_blank"
          rel="noreferrer"
        >
          https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
        </a>
      </p>
      <p>
        If you are located in Switzerland, the contact details for the data
        protection authorities are available here:&nbsp;
        <a
          href="https://www.edoeb.admin.ch/edoeb/en/home.html"
          title="https://www.edoeb.admin.ch/edoeb/en/home.html"
          target="_blank"
          rel="noreferrer"
        >
          https://www.edoeb.admin.ch/edoeb/en/home.html
        </a>
      </p>
      <p>
        <strong>
          <u>Withdrawing your consent:</u>
        </strong>
        &nbsp;If we are relying on your consent to process your personal
        information,&nbsp;which may be express and/or implied consent depending
        on the applicable law,&nbsp;you have the right to withdraw your consent
        at any time. You can withdraw your consent at any time by contacting us
        by using the contact details provided in the section&nbsp;"
        <AnchorComponent to="PrivacyPolicy-14" title="#14">
          HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </AnchorComponent>
        "&nbsp;below.
      </p>
      <p>
        However, please note that this will not affect the lawfulness of the
        processing before its withdrawal, nor&nbsp;when applicable law
        allows,&nbsp;will it affect the processing of your personal information
        conducted in reliance on lawful processing grounds other than consent.
      </p>
      <p>
        <strong>
          <u>Opting out of marketing and promotional communications:&nbsp;</u>
        </strong>
        You can unsubscribe from our marketing and promotional communications at
        any time by&nbsp;clicking on the unsubscribe link in the emails that we
        send,&nbsp;or by contacting us using the details provided in the
        section&nbsp;"
        <AnchorComponent to="PrivacyPolicy-14" title="#14">
          HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </AnchorComponent>
        "&nbsp;below. You will then be removed from the marketing lists.
        However, we may still communicate with you — for example, to send you
        service-related messages that are necessary for the administration and
        use of your account, to respond to service requests, or for other
        non-marketing purposes.
      </p>
      <p>
        <strong>Account Information</strong>
      </p>
      <p>
        If you would at any time like to review or change the information in
        your account, you can:
      </p>
      <ul>
        <li>
          <p>Log in to your account settings and update your user account.</p>
        </li>
      </ul>
      <p>
        Upon your{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          request to terminate
        </a>{' '}
        your account, we will deactivate or delete your account and information
        from our active databases. However, we may retain some information in
        our files to prevent fraud, troubleshoot problems, assist with any
        investigations, enforce our legal terms and/or comply with applicable
        legal requirements.
      </p>
      <p>
        <strong>
          <u>Cookies and similar technologies:</u>
        </strong>
        &nbsp;Most Web browsers are set to accept cookies by default. If you
        prefer, you can usually choose to set your browser to remove cookies and
        to reject cookies. If you choose to remove cookies or reject cookies,
        this could affect certain features or services of our Services.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-11">
        <strong>11. CONTROLS FOR DO-NOT-TRACK FEATURES</strong>
      </h4>
      <p>
        Most web browsers and some mobile operating systems and mobile
        applications include a Do-Not-Track ("DNT") feature or setting you can
        activate to signal your privacy preference not to have data about your
        online browsing activities monitored and collected. At this stage no
        uniform technology standard for&nbsp;recognizing&nbsp;and implementing
        DNT signals has been&nbsp;finalized. As such, we do not currently
        respond to DNT browser signals or any other mechanism that automatically
        communicates your choice not to be tracked online. If a standard for
        online tracking is adopted that we must follow in the future, we will
        inform you about that practice in a revised version of this privacy
        notice.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-12">
        <strong>
          12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>Yes, if you are a resident of
          California, you are granted specific rights regarding access to your
          personal information.
        </em>
      </p>
      <p>
        California Civil Code Section 1798.83, also known as the&nbsp;"Shine The
        Light"&nbsp;law, permits our users who are California residents to
        request and obtain from us, once a year and free of charge, information
        about categories of personal information (if any) we disclosed to third
        parties for direct marketing purposes and the names and addresses of all
        third parties with which we shared personal information in the
        immediately preceding calendar year. If you are a California resident
        and would like to make such a request, please submit your request in
        writing to us using the contact information provided below.
      </p>
      <p>
        If you are under 18 years of age, reside in California, and have a
        registered account with Services, you have the right to request removal
        of unwanted data that you publicly post on the Services. To request
        removal of such data, please contact us using the contact information
        provided below and include the email address associated with your
        account and a statement that you reside in California. We will make sure
        the data is not publicly displayed on the Services, but please be aware
        that the data may not be completely or comprehensively removed from all
        our systems (e.g.,&nbsp;backups, etc.).
      </p>
      <p>
        <strong>CCPA Privacy Notice</strong>
      </p>
      <p>
        The California Code of Regulations defines a&nbsp;"resident"&nbsp;as:
      </p>
      <p>
        (1) every individual who is in the State of California for other than a
        temporary or transitory purpose and
      </p>
      <p>
        (2) every individual who is domiciled in the State of California who is
        outside the State of California for a temporary or transitory purpose
      </p>
      <p>All other individuals are defined as&nbsp;"non-residents."</p>
      <p>
        If this definition of&nbsp;"resident"&nbsp;applies to you, we must
        adhere to certain rights and obligations regarding your personal
        information.
      </p>
      <p>
        <strong>What categories of personal information do we collect?</strong>
      </p>
      <p>
        We have collected the following categories of personal information in
        the past twelve (12) months:
      </p>
      <div>
        <table className={classes.table}>
          <tbody>
            <tr>
              <td>
                <p>
                  <strong>Category</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Examples</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Collected</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>A. Identifiers</p>
              </td>
              <td>
                <p>
                  Contact details, such as real name, alias, postal address,
                  telephone or mobile contact number, unique personal
                  identifier, online identifier, Internet Protocol address,
                  email address, and account name
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>YES</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  B. Personal information categories listed in the California
                  Customer Records statute
                </p>
              </td>
              <td>
                <p>
                  Name, contact information, education, employment, employment
                  history, and financial information
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>YES</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  C. Protected classification characteristics under California
                  or federal law
                </p>
              </td>
              <td>
                <p>Gender and date of birth</p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>D. Commercial information</p>
              </td>
              <td>
                <p>
                  Transaction information, purchase history, financial details,
                  and payment information
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>E. Biometric information</p>
              </td>
              <td>
                <p>Fingerprints and voiceprints</p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>F. Internet or other similar network activity</p>
              </td>
              <td>
                <p>
                  Browsing history, search history, online&nbsp;behavior,
                  interest data, and interactions with our and other websites,
                  applications, systems, and advertisements
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>YES</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>G. Geolocation data</p>
              </td>
              <td>
                <p>Device location</p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>YES</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  H. Audio, electronic, visual, thermal, olfactory, or similar
                  information
                </p>
              </td>
              <td>
                <p>
                  Images and audio, video or call recordings created in
                  connection with our business activities
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>I. Professional or employment-related information</p>
              </td>
              <td>
                <p>
                  Business contact details in order to provide you our services
                  at a business level or job title, work history, and
                  professional qualifications if you apply for a job with us
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>J. Education Information</p>
              </td>
              <td>
                <p>Student records and directory information</p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
                <p>&nbsp;</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>K. Inferences drawn from other personal information</p>
              </td>
              <td>
                <p>
                  Inferences drawn from any of the collected personal
                  information listed above to create a profile or summary about,
                  for example, an individual’s preferences and characteristics
                </p>
              </td>
              <td>
                <p>&nbsp;</p>
                <p>NO</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We may also collect other personal information outside of these
        categories instances where you interact with us in person, online, or by
        phone or mail in the context of:
      </p>
      <ul>
        <li>
          <p>Receiving help through our customer support channels;</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>Participation in customer surveys or contests; and</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            Facilitation in the delivery of our Services and to respond to your
            inquiries.
          </p>
        </li>
      </ul>
      <p>
        <strong>How do we use and share your personal information?</strong>
      </p>
      <p>
        More information about our data collection and sharing practices can be
        found in this privacy notice.
      </p>
      <p>
        You may contact us&nbsp;or by referring to the contact details at the
        bottom of this document.
      </p>
      <p>
        If you are using an&nbsp;authorized&nbsp;agent to exercise your right to
        opt out we may deny a request if the&nbsp;authorized&nbsp;agent does not
        submit proof that they have been validly&nbsp;authorized&nbsp;to act on
        your behalf.
      </p>
      <p>
        <strong>Will your information be shared with anyone else?</strong>
      </p>
      <p>
        We may disclose your personal information with our service providers
        pursuant to a written contract between us and each service provider.
        Each service provider is a for-profit entity that processes the
        information on our behalf.
      </p>
      <p>
        We may use your personal information for our own business purposes, such
        as for undertaking internal research for technological development and
        demonstration. This is not considered to be&nbsp;"selling"&nbsp;of your
        personal information.
      </p>
      <p>
        FIO (BVI), Ltd&nbsp;does not sell any personal information to third
        parties for a business or commercial purpose.
      </p>
      <p>
        The categories of third parties to whom we disclosed personal
        information for a business or commercial purpose can be found
        under&nbsp;"
        <AnchorComponent to="PrivacyPolicy-4" title="#4">
          WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </AnchorComponent>
        ".
      </p>
      <p>
        <strong>Your rights with respect to your personal data</strong>
      </p>
      <p>
        <u>Right to request deletion of the data — Request to delete</u>
      </p>
      <p>
        You can ask for the deletion of your personal information. If you ask us
        to delete your personal information, we will respect your request and
        delete your personal information, subject to certain exceptions provided
        by law, such as (but not limited to) the exercise by another consumer of
        his or her right to free speech, our compliance requirements resulting
        from a legal obligation, or any processing that may be required to
        protect against illegal activities.
      </p>
      <p>
        <u>Right to be informed — Request to know</u>
      </p>
      <p>Depending on the circumstances, you have a right to know:</p>
      <ul>
        <li>
          <p>whether we collect and use your personal information;</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>the categories of personal information that we collect;</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            the purposes for which the collected personal information is used;
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>whether we sell your personal information to third parties;</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            the categories of personal information that we sold or disclosed for
            a business purpose;
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            the categories of third parties to whom the personal information was
            sold or disclosed for a business purpose; and
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            the business or commercial purpose for collecting or selling
            personal information.
          </p>
        </li>
      </ul>
      <p>
        In accordance with applicable law, we are not obligated to provide or
        delete consumer information that is de-identified in response to a
        consumer request or to re-identify individual data to verify a consumer
        request.
      </p>
      <p>
        <u>
          Right to Non-Discrimination for the Exercise of a Consumer’s Privacy
          Rights
        </u>
      </p>
      <p>
        We will not discriminate against you if you exercise your privacy
        rights.
      </p>
      <p>
        <u>Verification process</u>
      </p>
      <p>
        Upon receiving your request, we will need to verify your identity to
        determine you are the same person about whom we have the information in
        our system. These verification efforts require us to ask you to provide
        information so that we can match it with information you have previously
        provided us. For instance, depending on the type of request you submit,
        we may ask you to provide certain information so that we can match the
        information you provide with the information we already have on file, or
        we may contact you through a communication method (e.g.,&nbsp;phone or
        email) that you have previously provided to us. We may also use other
        verification methods as the circumstances dictate.
      </p>
      <p>
        We will only use personal information provided in your request to verify
        your identity or authority to make the request. To the extent possible,
        we will avoid requesting additional information from you for the
        purposes of verification. However, if we cannot verify your identity
        from the information already maintained by us, we may request that you
        provide additional information for the purposes of verifying your
        identity and for security or fraud-prevention purposes. We will delete
        such additionally provided information as soon as we finish verifying
        you.
      </p>
      <p>
        <u>Other privacy rights</u>
      </p>
      <ul>
        <li>
          <p>You may object to the processing of your personal information.</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            You may request correction of your personal data if it is incorrect
            or no longer relevant, or ask to restrict the processing of the
            information.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            You can designate an&nbsp;authorized&nbsp;agent to make a request
            under the CCPA on your behalf. We may deny a request from
            an&nbsp;authorized&nbsp;agent that does not submit proof that they
            have been validly&nbsp;authorized&nbsp;to act on your behalf in
            accordance with the CCPA.
          </p>
        </li>
      </ul>
      <ul>
        <li>
          <p>
            You may request to opt out from future selling of your personal
            information to third parties. Upon receiving an opt-out request, we
            will act upon the request as soon as feasibly possible, but no later
            than fifteen (15) days from the date of the request submission.
          </p>
        </li>
      </ul>
      <p>
        To exercise these rights, you can contact us&nbsp;or by referring to the
        contact details at the bottom of this document. If you have a complaint
        about how we handle your data, we would like to hear from you.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-13">
        <strong>13. DO WE MAKE UPDATES TO THIS NOTICE?</strong>
      </h4>
      <p>
        <em>
          <strong>In Short:&nbsp;</strong>Yes, we will update this notice as
          necessary to stay compliant with relevant laws.
        </em>
      </p>
      <p>
        We may update this privacy notice from time to time. The updated version
        will be indicated by an updated&nbsp;"Revised"&nbsp;date and the updated
        version will be effective as soon as it is accessible. If we make
        material changes to this privacy notice, we may notify you either by
        prominently posting a notice of such changes or by directly sending you
        a notification. We encourage you to review this privacy notice
        frequently to be informed of how we are protecting your information.
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-14">
        <strong>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</strong>
      </h4>
      <p>
        If you have questions or comments about this notice, you may contact us
        by{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          submitting a support ticket
        </a>
        .
      </p>
      <h4 className={classes.header} id="PrivacyPolicy-15">
        <strong>
          15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
          YOU?
        </strong>
      </h4>
      <p>
        Based on the applicable laws of your country, you may have the right to
        request access to the personal information we collect from you, change
        that information, or delete it. To request to review, update, or delete
        your personal information, please&nbsp; contact us by{' '}
        <a
          href="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          title="https://fioprotocol.atlassian.net/servicedesk/customer/portal/4"
          target="_blank"
          rel="noreferrer"
        >
          submitting a support ticket
        </a>
        .
      </p>
    </LayoutContainer>
  );
};

export default PrivacyPolicyPage;
