import { FormApi, FormState } from 'final-form';
import { useEffect } from 'react';
import debounce from 'lodash/debounce';

import { AdminDefaults } from '../../api/responses';

const RANK_REARRANGEMENT_DELAY_MS = 500;

export function useRearrangeRanks(
  fieldName: keyof AdminDefaults,
  form: FormApi<AdminDefaults>,
): void {
  useEffect(() => {
    const subscriptionFn = debounce(
      (subscription: FormState<AdminDefaults>) => {
        if (!subscription.values) return;
        const items = subscription.values[fieldName];
        items.forEach((item, index) => {
          const expectedRank = index + 1;
          if (item.rank !== expectedRank) {
            form.mutators.update(fieldName, index, {
              ...item,
              rank: expectedRank,
            });
          }
        });
      },
      RANK_REARRANGEMENT_DELAY_MS,
    );
    const unsubscribe = form.subscribe(subscriptionFn, { values: true });
    return () => {
      unsubscribe();
    };
  }, []);
}
