import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import { PayWalletInfo } from '../../../components/Badges/PayWithBadge/PayWalletInfo';
import Loader from '../../../components/Loader/Loader';

import MathOp from '../../../util/math';

import { FioWalletDoublet, WalletsBalances } from '../../../types';

import classes from '../CheckoutPage.module.scss';

type Props = {
  assignmentWalletPublicKey: string;
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  assignmentWallet?: FioWalletDoublet;
  setAssignmentWallet: (publicKey: string) => void;
};

export const AssignmentWallet: React.FC<Props> = props => {
  const {
    assignmentWalletPublicKey,
    fioWallets,
    fioWalletsBalances,
    setAssignmentWallet,
  } = props;

  if (
    fioWallets.length === 0 ||
    !fioWalletsBalances.wallets[assignmentWalletPublicKey]
  ) {
    return <Loader />;
  }

  const walletsList = fioWallets.reduce((acc, wallet) => {
    const walletBalances = fioWalletsBalances.wallets[wallet.publicKey];
    if (!walletBalances) return acc;
    const { fio, usdc } = walletBalances.available;

    // Default option render is not updating when balances changed. We need to wait when balances are set.
    if (new MathOp(usdc).eq(0) && !new MathOp(fio).eq(0)) return acc;

    acc.push({
      id: wallet.publicKey,
      name: (
        <div className="p-2">
          <PayWalletInfo
            walletName={wallet.name}
            fioBalance={fio}
            usdcBalance={usdc}
          />
        </div>
      ),
    });

    return acc;
  }, []);

  // Waiting to default value set
  if (!walletsList.find(({ id }) => id === assignmentWalletPublicKey))
    return <Loader />;

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>FIO wallet Assignment</h6>
        <p className={classes.text}>
          Please choose which FIO wallet you would like to use for assignment
        </p>
      </div>

      <CustomDropdown
        onChange={setAssignmentWallet}
        options={walletsList}
        isWhite={true}
        isSimple={true}
        hasAutoHeight={true}
        value={assignmentWalletPublicKey}
        hasBigBorderRadius={true}
        isBlackPlaceholder={true}
        withoutMarginBottom={true}
      />
    </>
  );
};
