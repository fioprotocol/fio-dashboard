import { makeServiceRunner } from '../tools';
import ActionsSubmit from '../services/actions/Submit';

export default {
  submit: makeServiceRunner(ActionsSubmit, req => ({
    ...(req.body.data || {}),
    hash: req.params.hash,
  })),
};
