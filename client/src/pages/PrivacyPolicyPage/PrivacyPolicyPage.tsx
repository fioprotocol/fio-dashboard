import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import classes from './PrivacyPolicyPage.module.scss';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <LayoutContainer title="Privacy Policy">
      <h3 className={classes.header}>Introduction.</h3>
      <p>
        This Privacy Policy (together with our Terms of Use and any other
        documents referred to in it) applies to the FIO Protocol Website located
        at{' '}
        <a href="https://fioprotocol.io/" target="_blank" rel="noreferrer">
          fioprotocol.io
        </a>{' '}
        website and the FIO Dashboard website located at{' '}
        <a
          href="https://dashboard.fioprotocol.io/"
          target="_blank"
          rel="noreferrer"
        >
          dashboard.fioprotocol.io
        </a>{' '}
        (collectively the “Service”) and sets out the basis on which any
        personal data we collect from you, or that you provide to us, will be
        handled by us. In this Privacy Policy, the term “personal data” means
        information that relates to an identified or identifiable natural
        person.
      </p>
      <p>
        We know that you are concerned about how we use and disclose personal
        data, and we are committed to complying with data protection and privacy
        laws that apply to us. This Privacy Policy tells you about the ways in
        which we protect your privacy and personal data we process about you.
      </p>
      <p>
        We wish to remind you that this Privacy Policy applies to personal data
        that we process when you use the Service. It does not apply to any links
        to third parties’ websites and/or services, such as third-party
        applications, that you may encounter when you use the Service. We
        encourage you to carefully familiarize yourself with privacy policies
        applicable to any websites and/or services operated by third parties.
        Please be aware that we are not responsible for the privacy practices of
        any third parties. By using the Service, you accept the privacy
        practices described in this Privacy Policy.
      </p>

      <h3 className={classes.header}>Information we may collect from You.</h3>
      <h4 className={classes.subheader}>Data You Provide to the Service</h4>
      <p>
        We may collect the following information from our users in connection
        with registration or their use of the Service (each such user a
        “Registered User”) that may, in certain circumstances, constitute
        personal data:
      </p>
      <ul>
        <li>Name.</li>
        <li>Email address.</li>
        <li>Wallet address information when using FIO Dashboard.</li>
      </ul>
      <h4 className={classes.subheader}>Data Collected Automatically</h4>
      <p>
        The Service may automatically collect the following information from you
        that in certain circumstances may constitute personal data:
      </p>
      <ul>
        <li>
          Service use event data such as which links or buttons you have clicked
          and the pages you have viewed.
        </li>
        <li>The type of device you are using.</li>
        <li>The IP address from which you access the Service.</li>
        <li>Depending on your device settings, location data.</li>
        <li>The name and version of the device operating system.</li>
        <li>URL of the site from which you came.</li>
      </ul>
      <h4 className={classes.subheader}>
        The purposes for which we use the data.
      </h4>
      <ul>
        <li>To set up and maintain your registration with the Service.</li>
        <li>To communicate with you.</li>
        <li>To operate and improve the Service.</li>
        <li>To improve customer service.</li>
        <li>To personalize user experience.</li>
        <li>
          To run a promotion, contest, survey or other feature of the Service.
        </li>
      </ul>
      <h4 className={classes.subheader}>How we disclose the data.</h4>
      <p>
        We do not sell, lease, rent or otherwise disclose the personal data
        relating to our users to third parties unless otherwise stated below.
      </p>
      <p>
        The personal data collected in the Service may be disclosed in the
        following manner:
      </p>
      <ul>
        <li>
          To service providers, such as data analytics service providers, or
          data storage service providers, which enable us to provide the Service
          to you.
        </li>
      </ul>
      <h4 className={classes.subheader}>Wallet address information.</h4>
      <p>
        When you create a wallet through FIO Dashboard, encrypted wallet public
        key and private key pairs are automatically generated the Application
        and stored via our Service. We cannot access decrypted private key
        information and the decryption occurs only in your browser when you
        provide login credentials.
      </p>
      <h4 className={classes.subheader}>Security</h4>
      <p>
        We value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and we cannot guarantee
        its absolute security.
      </p>
      <h4 className={classes.subheader}>Cookies</h4>
      <p>
        We may place a “cookie” on the hard drive of the device that you use to
        access the Service. Cookies are text files that are saved on the hard
        drive of your device by means of your browser, enabling us to recognize
        your browser for purposes such as saving your preferences and directing
        relevant content to you. Most of the currently available browsers give
        you the option of managing cookies by, for example, disabling them
        entirely, accepting them individually, and deleting saved cookies from
        your hard drive. We would like to remind you that if you completely
        disable cookies on your browser, you might not be able to use some
        features of the Service.
      </p>
      <p>
        Google Analytics is an element of the Service. By using cookies, Google
        Analytics collects and stores data such as time of visit, pages visited,
        time spent on each page of the website, the IP address, and the type of
        operating system used in the devices used to access the Service. By
        using a browser plugin provided by Google, you can opt out of Google
        Analytics.
      </p>
      <h4 className={classes.subheader}>Children’s privacy.</h4>
      <p>
        This Service is not directed to children under 13. We do not intend to
        collect personal data from children under 13.
      </p>
      <h4 className={classes.subheader}>Changes to the privacy policy.</h4>
      <p>
        We may update our Privacy Policy from time to time. Thus, we advise you
        to review this page periodically for any changes. We will notify you of
        any changes by posting the new Privacy Policy on this page. These
        changes are effective immediately, after they are posted on this page.
      </p>
      <h4 className={classes.subheader}>Questions or Concerns</h4>
      <p>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us.
      </p>
    </LayoutContainer>
  );
};

export default PrivacyPolicyPage;
