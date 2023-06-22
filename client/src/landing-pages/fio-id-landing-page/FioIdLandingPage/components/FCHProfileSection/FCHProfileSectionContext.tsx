import { PaymentsTabComponent } from '../PaymentsTabComponent';
import { SocialsTabComponent } from '../SocialsTabComponent';

import { TabItemProps } from '../../../../../components/Tabs/types';

type UseContext = {
  tabsList: TabItemProps[];
};

const TABS_LIST = [
  {
    eventKey: 'payments',
    title: 'Payments',
    renderTab: (props: { fch: string }) => (
      <div>
        <PaymentsTabComponent {...props} />
      </div>
    ),
  },
  {
    eventKey: 'nft',
    title: 'NFT Signatures',
    renderTab: (props: any) => <div>NFT Signatures tab</div>,
  },
  {
    eventKey: 'socials',
    title: 'Socials',
    renderTab: (props: { fch: string }) => <SocialsTabComponent {...props} />,
  },
];

export const useContext = (): UseContext => {
  return { tabsList: TABS_LIST };
};
