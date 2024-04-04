import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import { ROUTES } from '../../constants/routes';
import config from '../../config';

import classes from '../PrivacyPolicyPage/PrivacyPolicyPage.module.scss';

const TermsOfServicePage: React.FC = () => {
  return (
    <LayoutContainer title="Terms of Service">
      <div>
        <br />
        <h4 className={classes.subtitle}>
          <strong>1. AGREEMENT TO TERMS</strong>
        </h4>
        <p>
          These Terms of Service constitute a legally binding agreement made
          between you, whether personally or on behalf of an entity (“you”) and
          FIO (BVI), Ltd ("FIO", “we”, “us”, or “our”), concerning your access
          to and use of the{' '}
          <a href="/" title={process.env.REACT_APP_BASE_URL}>
            {process.env.REACT_APP_BASE_URL?.slice(0, -1)}
          </a>{' '}
          website as well as any other media form, media channel, mobile website
          or mobile application related, linked, or otherwise connected thereto
          (collectively, the “Site”). We are registered in British Virgin
          Islands and have our registered office at c/o SHRM Trustees (BVI)
          Limited Trinity Chambers, P.O. Box 4301 Road Town, Tortola, British
          Virgin Islands. You agree that by accessing the Site, you have read,
          understood, and agreed to be bound by all of these Terms of Service.
          IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE
          EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE
          IMMEDIATELY.
        </p>
        <p>
          Supplemental terms and conditions or documents that may be posted on
          the Site from time to time are hereby expressly incorporated herein by
          reference. We reserve the right, in our sole discretion, to make
          changes or modifications to these Terms of Service from time to time.
          We will alert you about any changes by updating the “Last updated”
          date of these Terms of Service, and you waive any right to receive
          specific notice of each such change. Please ensure that you check the
          applicable Terms every time you use our Site so that you understand
          which Terms apply. You will be subject to, and will be deemed to have
          been made aware of and to have accepted, the changes in any revised
          Terms of Service by your continued use of the Site after the date such
          revised Terms of Service are posted.
        </p>
        <p>
          The information provided on the Site is not intended for distribution
          to or use by any person or entity in any jurisdiction or country where
          such distribution or use would be contrary to law or regulation or
          which would subject us to any registration requirement within such
          jurisdiction or country. Accordingly, those persons who choose to
          access the Site from other locations do soon their own initiative and
          are solely responsible for compliance with local laws, if and to the
          extent local laws are applicable.
        </p>
        <p>
          The Site is not tailored to comply with industry-specific regulations
          (Health Insurance Portability and Accountability Act (HIPAA), Federal
          Information Security Management Act (FISMA),etc.), so if your
          interactions would be subjected to such laws, you may not use this
          Site. You may not use the Site in a way that would violate the
          Gramm-Leach-Bliley Act (GLBA). The Site is intended for users who are
          at least 18 years old. Persons under the age of 18 are not permitted
          to use or register for the Site.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>2. USER REPRESENTATIONS</strong>
        </h4>
        <p>
          By using the Site, you represent and warrant that: (1) all
          registration information you submit will be true, accurate, current,
          and complete; (2) you will maintain the accuracy of such information
          and promptly update such registration information as necessary; (3)
          you have the legal capacity and you agree to comply with these Terms
          of Service; (4) you are not a minor in the jurisdiction in which you
          reside; (5) you will not access the Site through automated or
          non-human means, whether through a bot, script or otherwise; (6) you
          will not use the Site for any illegal or unauthorized purpose; and (7)
          your use of the Site will not violate any applicable law or
          regulation.
        </p>
        <p>
          If you provide any information that is untrue, inaccurate, not
          current, or incomplete, we have the right to suspend or terminate your
          account and refuse any and all current or future use of the Site (or
          any portion thereof).
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>3. USER REGISTRATION AND SELF-CUSTODY</strong>
        </h4>
        <p>
          You may be required to register with the Site. You are responsible for
          safekeeping your passwords, private keys, mnemonic phrases, PINs,
          secret answers, multi-factor authentication codes and any other
          sensitive information (“Sensitive Information”) required to access the
          Site. Only the holder of the Sensitive Information is able to access
          cryptocurrencies or non-fungible tokens (“Digital Assets”) associated
          with your account. For security purposes, we do not have access to
          your Sensitive Information, do not serve as financial intermediary or
          custodian of your Digital Assets and therefore cannot access your
          Digital Assets. Furthermore, were you to release, willingly or
          unwillingly, your Sensitive Information to an unauthorized party, we
          would not have a way of preventing that unauthorized party from
          accessing your Digital Assets.
        </p>
        <p>
          IF YOU LOSE ACCESS TO THE SITE, WALLET, EMAIL ADDRESS OR PASSWORD AND
          YOU HAVE NOT SEPARATELY CREATED CORRESPONDING RECOVERY QUESTIONS AND
          ANSWERS, YOU ACKNOWLEDGE AND AGREE THAT ANY CRYPTOCURRENCY AND NFTS
          YOU HAVE ASSOCIATED WITH THAT FIO APP WALLET WILL BECOME INACCESSIBLE.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>4. BLOCKCHAIN TRANSACTIONS</strong>
        </h4>
        <p>
          In order for all proposed Digital Assets transactions to be completed,
          they must be confirmed and recorded in the digital asset’s associated
          public blockchain. Such networks are decentralized, peer-to-peer
          networks supported by independent third parties, which we do not own,
          control, or operate. We have no control over the blockchain networks
          and, therefore, cannot and do not ensure that any transaction details
          that you submit via our Site will be confirmed and processed. By using
          the Site, you acknowledge and agree that: (i) we do not have the
          ability to cancel or otherwise modify your transaction; (ii) the
          transaction details you submit may not be completed, or may be
          substantially delayed, by the applicable blockchain networks; (iii) we
          do not store, send, or receive Digital Assets; and (iv) any transfer
          that occurs in relation to any Digital Assets occurs on the relevant
          blockchain network and not on a network owned by us and therefore we
          do not guarantee the transfer of title or right in any digital asset.
        </p>
        <p>
          Certain features of the Site require you to send tokens directly to
          the blockchain as blockchain fees. All transactions submitted to the
          blockchain are final and irreversible and cannot be cancelled or
          refunded. You must ensure that you have an adequate balance in your
          wallet and/or “gas” to complete transactions before initiating itn.
          You acknowledge and agree that we will not be liable for any failed
          transactions due to insufficient funds or gas associated with your
          wallet address.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>5. PURCHASES AND PAYMENT</strong>
        </h4>
        <p>
          The Site allows you to pay for certain blockchain transactions using
          forms of payment as offered by{' '}
          <a
            href="https://stripe.com/"
            title="https://stripe.com/"
            target="_blank"
            rel="noreferrer"
          >
            Stripe
          </a>
          , a third-party credit card processing company. You agree to provide
          current, complete, and accurate purchase and account information for
          all purchases made via the Site. You agree to pay all charges at the
          prices then in effect for your purchases, and you authorize us to
          charge your chosen form of payment for any such amounts upon placing
          your order. We reserve the right to correct any errors or mistakes in
          pricing, even if we have already requested or received payment. We may
          change prices at any time. All payments shall be in U.S. Dollars.
        </p>
        <p>
          We reserve the right to refuse any order placed through the Site.
          These restrictions may include orders placed by or under the same
          customer account, and/or the same payment method. We reserve the right
          to limit or prohibit orders that, in our sole judgment, appear to be
          fraud.
        </p>
        <p>
          It is your responsibility to determine what, if any, taxes apply to
          the transactions that you have submitted via the Site, and it is your
          responsibility to report and remit the correct tax to the appropriate
          tax authority. You agree that we are not responsible for determining
          whether taxes apply to your transactions or for collecting, reporting,
          withholding, or remitting any taxes arising from any digital
          asset-related transactions.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>6. REFUNDS POLICY</strong>
        </h4>
        <p>All sales are final and no refund will be issued.</p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>7. PROHIBITED ACTIVITIES</strong>
        </h4>
        <p>
          You may not access or use the Site for any purpose other than that for
          which we make the Site available.
        </p>
        <p>As a user of the Site, you agree not to:</p>
        <ul>
          <li>
            <p>
              Systematically retrieve data or other content from the Site to
              create or compile, directly or indirectly, a collection,
              compilation, database, or directory without written permission
              from us.
            </p>
          </li>
          <li>
            <p>
              Trick, defraud, or mislead us and other users, especially in any
              attempt to learn sensitive account information such as user
              passwords.
            </p>
          </li>
          <li>
            <p>
              Circumvent, disable, or otherwise interfere with security-related
              features of the Site, including features that prevent or restrict
              the use or copying of any Content or enforce limitations on the
              use of the Site and/or the Content contained therein.
            </p>
          </li>
          <li>
            <p>
              Disparage, tarnish, or otherwise harm, in our opinion, us and/or
              the Site.
            </p>
          </li>
          <li>
            <p>
              Use any information obtained from the Site in order to harass,
              abuse, or harm another person.
            </p>
          </li>
          <li>
            <p>
              Make improper use of our support services or submit false reports
              of abuse or misconduct.
            </p>
          </li>
          <li>
            <p>
              Use the Site in a manner inconsistent with any applicable laws or
              regulations.
            </p>
          </li>
          <li>
            <p>Engage in unauthorized framing of or linking to the Site.</p>
          </li>
          <li>
            <p>
              Upload or transmit (or attempt to upload or to transmit) viruses,
              Trojan horses, or other material, including excessive use of
              capital letters and spamming (continuous posting of repetitive
              text), that interferes with any party’s uninterrupted use and
              enjoyment of the Site or modifies, impairs, disrupts, alters, or
              interferes with the use, features, functions, operation, or
              maintenance of the Site.
            </p>
          </li>
          <li>
            <p>
              Engage in any automated use of the system, such as using scripts
              to send comments or messages, or using any data mining, robots, or
              similar data gathering and extraction tools.
            </p>
          </li>
          <li>
            <p>
              Attempt to impersonate another user or person or use the username
              of another user.
            </p>
          </li>
          <li>
            <p>
              Upload or transmit (or attempt to upload or to transmit) any
              material that acts as a passive or active information collection
              or transmission mechanism, including without limitation, clear
              graphics interchange formats (“gifs”), 1×1 pixels, web bugs,
              cookies, or other similar devices (sometimes referred to as
              “spyware” or “passive collection mechanisms” or “pcms”).
            </p>
          </li>
          <li>
            <p>
              Interfere with, disrupt, or create an undue burden on the Site or
              the networks or services connected to the Site.
            </p>
          </li>
          <li>
            <p>
              Harass, annoy, intimidate, or threaten any of our employees or
              agents engaged in providing any portion of the Site to you.
            </p>
          </li>
          <li>
            <p>
              Attempt to bypass any measures of the Site designed to prevent or
              restrict access to the Site, or any portion of the Site.
            </p>
          </li>
          <li>
            <p>
              Except as may be the result of standard search engine or Internet
              browser usage, use, launch, develop, or distribute any automated
              system, including without limitation, any spider, robot, cheat
              utility, scraper, or offline reader that accesses the Site, or
              using or launching any unauthorized script or other software.
            </p>
          </li>
          <li>
            <p>
              Use a buying agent or purchasing agent to make purchases on the
              Site.
            </p>
          </li>
          <li>
            <p>
              Make any unauthorized use of the Site, including collecting
              usernames and/or email addresses of users by electronic or other
              means for the purpose of sending unsolicited email, or creating
              user accounts by automated means or under false pretenses.
            </p>
          </li>
          <li>
            <p>
              Use the Site to advertise or offer to sell goods and services.
            </p>
          </li>
        </ul>
        <br />
        <h4 className={classes.subtitle}>
          <strong>8. THIRD-PARTY WEBSITES AND CONTENT</strong>
        </h4>
        <p>
          The Site may contain (or you may be sent via the Site) links to other
          websites ("Third-Party Websites") as well as articles, photographs,
          text, graphics, pictures,designs, music, sound, video, information,
          applications, software, and other content or items belonging to or
          originating from third parties ("Third-Party Content"). Such
          Third-Party Websites and Third-Party Content are not investigated,
          monitored, or checked for accuracy, appropriateness, or completeness
          by us, and we are not responsible for any Third Party Websites
          accessed through the Site or any Third-Party Content posted on,
          available through, or installed from the Site, including the content,
          accuracy, offensiveness, opinions, reliability, privacy practices, or
          other policies of or contained in the Third-Party Websites or the
          Third-Party Content. Inclusion of, linking to, or permitting the use
          or installation of any Third-Party Websites or any Third-Party Content
          does not imply approval or endorsement thereof by us. If you decide to
          leave the Site and access the Third-Party Websites or to use or
          install any Third-Party Content, you do so at your own risk, and you
          should be aware these Terms of Service no longer govern. You should
          review the applicable terms and policies, including privacy and data
          gathering practices, of any website to which you navigate from the
          Site or relating to any applications you use or install from the Site.
          Any purchases you make through Third-Party Websites will be through
          other websites and from other companies, and we take no responsibility
          whatsoever in relation to such purchases which are exclusively between
          you and the applicable third party. You agree and acknowledge that we
          do not endorse the products or services offered on Third-Party
          Websites and you shall hold us harmless from any harm caused by your
          purchase of such products or services. Additionally, you shall hold us
          harmless from any losses sustained by you or harm caused to you
          relating to or resulting in any way from any Third-Party Content or
          any contact with Third-Party Websites.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>9. SITE MANAGEMENT</strong>
        </h4>
        <p>
          We reserve the right, but not the obligation, to: (1) monitor the Site
          for violations of these Terms of Service; (2) take appropriate legal
          action against anyone who, in our sole discretion, violates the law or
          these Terms of Service, including without limitation, reporting such
          user to law enforcement authorities; (3) in our sole discretion and
          without limitation, refuse, restrict access to, limit the availability
          of, or disable (to the extent technologically feasible) any of your
          Contributions or any portion thereof; (4) in our sole discretion and
          without limitation, notice, or liability, to remove from the Site or
          otherwise disable all files and content that are excessive in size or
          are in any way burdensome to our systems; and (5) otherwise manage the
          Site in a manner designed to protect our rights and property and to
          facilitate the proper functioning of the Site.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>10. PRIVACY POLICY</strong>
        </h4>
        <p>
          We care about data privacy and security. Please review our Privacy
          Policy:{' '}
          <a
            href={ROUTES.PRIVACY_POLICY}
            title={`${process.env.REACT_APP_BASE_URL}${ROUTES.PRIVACY_POLICY}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${process.env.REACT_APP_BASE_URL?.slice(0, -1)}${
              ROUTES.PRIVACY_POLICY
            }`}
          </a>
          . By using the Site , you agree to be bound by our Privacy Policy,
          which is incorporated into these Terms of Service. Please be advised
          the Site is hosted in the United States. If you access the Site from
          any other region of the world with laws or other requirements
          governing personal data collection, use, or disclosure that differ
          from applicable laws in the United States, then through your continued
          use of the Site, you are transferring your data to the United States,
          and you expressly consent to have your data transferred to and
          processed in the United States.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>11. TERM AND TERMINATION</strong>
        </h4>
        <p>
          These Terms of Service shall remain in full force and effect while you
          use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF
          SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT
          NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING
          BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO
          REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
          WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF SERVICE OR OF ANY
          APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR
          PARTICIPATION IN THE SITE OR DELETE YOUR ACCOUNT AND ANY CONTENT OR
          INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE
          DISCRETION.
        </p>
        <p>
          If we terminate or suspend your account for any reason, you are
          prohibited from registering and creating a new account under your
          name, a fake or borrowed name, or the name of any third party, even if
          you may be acting on behalf of the third party. In addition to
          terminating or suspending your account, we reserve the right to take
          appropriate legal action, including without limitation pursuing civil,
          criminal, and injunctive redress.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>12. MODIFICATIONS AND INTERRUPTIONS</strong>
        </h4>
        <p>
          We reserve the right to change, modify, or remove the contents of the
          Site at any time or for any reason at our sole discretion without
          notice. However, we have no obligation to update any information on
          our Site. We will not be liable to you or any third party for any
          modification, price change, suspension, or discontinuance of the Site.
        </p>
        <p>
          We cannot guarantee the Site will be available at all times. We may
          experience hardware, software, or other problems or need to perform
          maintenance related to the Site, resulting in interruptions, delays,
          or errors. We reserve the right to change, revise, update, suspend,
          discontinue, or otherwise modify the Site any time or for any reason
          without notice to you. You agree that we have no liability whatsoever
          for any loss, damage, or inconvenience caused by your inability to
          access or use the Site during any downtime or discontinuance of the
          Site. Nothing in these Terms of Service will be construed to obligate
          us to maintain and support the Site or to supply any corrections,
          updates, or releases in connection therewith.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>13. DISPUTE RESOLUTION</strong>
        </h4>
        <p>
          <strong>13.1 Informal Negotiations</strong>
          <br />
          To expedite resolution and control the cost of any dispute,
          controversy, or claim related to these Terms of Service (each
          "Dispute" and collectively, the “Disputes”) brought by either you or
          us(individually, a “Party” and collectively, the “Parties”), the
          Parties agree to first attempt to negotiate any Dispute (except those
          Disputes expressly provided below) informally for at least ninety (90)
          days before initiating arbitration. Such informal negotiations
          commence upon written notice from one Party to the other Party.
        </p>
        <p>
          <strong>13.2 Binding Arbitration</strong>
          <br />
          If the Parties are unable to resolve a Dispute through informal
          negotiations, the Dispute (except those Disputes expressly excluded
          below) will be finally and exclusively resolved by binding
          arbitration. YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD
          HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. The arbitration
          shall be commenced and conducted under the Commercial Arbitration
          Rules of the American Arbitration Association ("AAA") and, where
          appropriate, the AAA’s Supplementary Procedures for Consumer Related
          Disputes ("AAA Consumer Rules"), both of which are available at the
          AAA website{' '}
          <a href="http://www.adr.org" title="http://www.adr.org">
            www.adr.org
          </a>
          . Your arbitration fees and your share of arbitrator compensation
          shall be governed by the AAA Consumer Rules and, where appropriate,
          limited by the AAA Consumer Rules. The arbitration may be conducted in
          person, through the submission of documents, by phone, or online.The
          arbitrator will make a decision in writing, but need not provide a
          statement of reasons unless requested by either Party. The arbitrator
          must follow applicable law, and any award may be challenged if the
          arbitrator fails to do so. Except where otherwise required by the
          applicable AAA rules or applicable law, the arbitration will take
          place in Puerto Rico. Except as otherwise provided herein, the Parties
          may litigate in court to compel arbitration, stay proceedings pending
          arbitration, or to confirm, modify, vacate, or enter judgment on the
          award entered by the arbitrator.
        </p>
        <p>
          If for any reason, a Dispute proceeds in court rather than
          arbitration, the Dispute shall be commenced or prosecuted in the
          federal courts located in United States, and the Parties hereby
          consent to, and waive all defenses of lack of personal jurisdiction,
          and forum non conveniens with respect to venue and jurisdiction in
          such federal courts. Application of the United Nations Convention on
          Contracts for the International Sale of Goods and the Uniform Computer
          Information Transaction Act (UCITA) are excluded from these Terms of
          Service.
        </p>
        <p>
          In no event shall any Dispute brought by either Party related in any
          way to the Site be commenced more than one (1) years after the cause
          of action arose. If this provision is found to be illegal or
          unenforceable, then neither Party will elect to arbitrate any Dispute
          falling within that portion of this provision found to be illegal or
          unenforceable and such Dispute shall be decided by a court of
          competent jurisdiction within the courts listed for jurisdiction
          above, and the Parties agree to submit to the personal jurisdiction of
          that court.
        </p>
        <p>
          Restrictions
          <br />
          The Parties agree that any arbitration shall be limited to the Dispute
          between the Parties individually. To the full extent permitted by law,
          (a) no arbitration shall be joined with any other proceeding; (b)
          there is no right or authority for any Dispute to be arbitrated on a
          class-action basis or to utilize class action procedures; and (c)
          there is no right or authority for any Dispute to be brought in a
          purported representative capacity on behalf of the general public or
          any other persons.
        </p>
        <p>
          Exceptions to Informal Negotiations and Arbitration
          <br />
          The Parties agree that the following Disputes are not subject to the
          above provisions concerning informal negotiations binding arbitration:
          (a) any Disputes seeking to enforce or protect, or concerning the
          validity of, any of the intellectual property rights of a Party; (b)
          any Dispute related to, or arising from, allegations of theft, piracy,
          invasion of privacy, or unauthorized use; and(c) any claim for
          injunctive relief. If this provision is found to be illegal or
          unenforceable, then neither Party will elect to arbitrate any Dispute
          falling within that portion of this provision found to be illegal or
          unenforceable and such Dispute shall be decided by a court of
          competent jurisdiction within the courts listed for jurisdiction
          above, and the Parties agree to submit to the personal jurisdiction of
          that court.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>14. CORRECTIONS</strong>
        </h4>
        <p>
          There may be information on the Site that contains typographical
          errors, inaccuracies, including descriptions, pricing, availability,
          and various other information. We reserve the right to correct any
          errors, inaccuracies, or omissions and to change or update the
          information on the Site at any time, without prior notice.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>15. DISCLAIMER</strong>
        </h4>
        <p>
          THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
          THAT YOUR USE OF THE SITE SERVICES WILL BE AT YOUR SOLE RISK. TO THE
          FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS
          OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF,
          INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE
          ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY
          WEBSITES LINKED TO THIS SITE AND WE WILL ASSUME NO LIABILITY OR
          RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
          CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY
          NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE,
          (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY
          AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
          THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM
          THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY
          BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6)
          ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS
          OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
          POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO
          NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY
          PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE
          SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION
          FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A
          PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
          BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS
          WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY
          ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION
          WHERE APPROPRIATE.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>16. LIMITATIONS OF LIABILITY</strong>
        </h4>
        <p>
          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
          TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT,
          CONSEQUENTIAL,EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES,
          INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES
          ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE
          POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY
          CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND
          REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO
          THE AMOUNT PAID, IF ANY, BY YOU TO US . CERTAIN US STATE LAWS AND
          INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR
          THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO
          YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY
          TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>17. INDEMNIFICATION</strong>
        </h4>
        <p>
          You agree to defend, indemnify, and hold us harmless, including our
          subsidiaries, affiliates, and all of our respective officers, agents,
          partners, and employees, from and against any loss,damage, liability,
          claim, or demand, including reasonable attorneys’ fees and expenses,
          made by any third party due to or arising out of: (1) use of the Site;
          (2) breach of these Terms of Service; (3) any breach of your
          representations and warranties set forth in these Terms of Service;
          (4) your violation of the rights of a third party, including but not
          limited to intellectual property rights; or(5) any overt harmful act
          toward any other user of the Site with whom you connected via the
          Site. Notwithstanding the foregoing, we reserve the right, at your
          expense, to assume the exclusive defense and control of any matter for
          which you are required to indemnify us, and you agree to cooperate, at
          your expense, with our defense of such claims. We will use reasonable
          efforts to notify you of any such claim, action, or proceeding which
          is subject to this indemnification upon becoming aware of it.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>18. USER DATA</strong>
        </h4>
        <p>
          We will maintain certain data that you transmit to the Site for the
          purpose of managing the performance of the Site, as well as data
          relating to your use of the Site. Although we perform regular routine
          backups of data, you are solely responsible for all data that you
          transmit or that relates to any activity you have undertaken using the
          Site. You agree that we shall have no liability to you for any loss or
          corruption of any such data, and you hereby waive any right of action
          against us arising from any such loss or corruption of such data.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>
            19. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
          </strong>
        </h4>
        <p>
          <br />
          Visiting the Site, sending us emails, and completing online forms
          constitute electronic communications. You consent to receive
          electronic communications, and you agree that all agreements, notices,
          disclosures, and other communications we provide to you
          electronically, via email and on the Site, satisfy any legal
          requirement that such communication be in writing. YOU HEREBY AGREE TO
          THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER
          RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES,AND RECORDS
          OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. You
          hereby waive any rights or requirements under any statutes,
          regulations, rules,ordinances, or other laws in any jurisdiction which
          require an original signature or delivery or retention of
          non-electronic records, or to payments or the granting of credits by
          any means other than electronic means.
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>20. CALIFORNIA USERS AND RESIDENTS</strong>
        </h4>
        <p>
          If any complaint with us is not satisfactorily resolved, you can
          contact the Complaint Assistance Unit of the Division of Consumer
          Services of the California Department of Consumer Affairs in writing
          at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834
          or by telephone at <a href="tel:(800) 952-5210">(800) 952-5210</a> or{' '}
          <a href="tel:(916) 445-1254">(916) 445-1254.</a>
        </p>
        <br />
        <h4 className={classes.subtitle}>
          <strong>21. CONTACT US</strong>
        </h4>
        <p>
          In order to resolve a complaint regarding the Site or to receive
          further information regarding use of the Site, please contact us by{' '}
          <a
            href={config.supportUrl}
            title={config.supportUrl}
            target="_blank"
            rel="noreferrer"
          >
            submitting a support ticket
          </a>
          .
        </p>
      </div>
    </LayoutContainer>
  );
};

export default TermsOfServicePage;
