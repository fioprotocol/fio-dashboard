import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

const TermsOfServicePage: React.FC = () => {
  return (
    <LayoutContainer title="Terms of Service">
      <p>
        The software you are about to use functions as a free, open source,
        digital wallet.
      </p>
      <p>
        IF YOU LOSE ACCESS TO YOUR <span className="boldText">DASHBOARD</span>{' '}
        WALLET EMAIL ADDRESS OR PASSWORD AND YOU HAVE NOT SEPARATELY CREATED
        CORRESPONDING RECOVERY QUESTIONS AND ANSWERS, YOU ACKNOWLEDGE AND AGREE
        THAT ANY CRYPTOCURRENCY YOU HAVE ASSOCIATED WITH THAT DASHBOARD WALLET
        WILL BECOME INACCESSIBLE.
      </p>
      <p>All transaction requests are irreversible.</p>
      <p>
        The software does not constitute an account where Foundation for
        Interwallet Operability (FIO) or other third parties serve as financial
        intermediaries or custodians of your cryptocurrency.
      </p>
      <p>
        You are responsible for safekeeping your passwords, private key pairs,
        PINs and any other codes you use to access the software. The authors of
        the software, FIO workers, or FIO cannot retrieve your private keys or
        passwords if you lose or forget them and cannot guarantee transaction
        confirmation as they do not have control over the cryptocurrency
        networks.
      </p>
      <p>
        While the software has undergone beta testing and continues to be
        improved by feedback from the open-source user and developer community,
        we cannot guarantee that there will be no bugs in the software. You
        acknowledge that your use of this software is at your own discretion and
        in compliance with all applicable laws in your jurisdiction. You assume
        any and all risks associated with the use of the software. In no event
        shall the authors of the software, FIO workers, or FIO be held liable
        for any claim, damages or other liability, whether in an action of
        contract, tort, or otherwise, arising from, out of or in connection with
        the software.
      </p>
      <p>
        To the fullest extent permitted by law, this software is provided “as
        is” and no representations or warranties can be made of any kind,
        express or implied, including but not limited to the warranties of
        merchantability, fitness or a particular purpose and noninfringement.
      </p>
      <p>We reserve the right to modify this disclaimer from time to time.</p>
      <p>By using the Dashboard you are agreeing to these Terms of Service.</p>
    </LayoutContainer>
  );
};

export default TermsOfServicePage;
