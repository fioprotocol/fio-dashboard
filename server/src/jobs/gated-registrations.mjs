import Sequelize from 'sequelize';

import '../db';
import { GatedRegistrtionTokens } from '../models/index.mjs';

import CommonJob from './job.mjs';

const CLEAR_GATED_REGISTRATION_TOKENS_TIME_PERIOD_IN_MINUTES =
  process.env.CLEAR_GATED_REGISTRATION_TOKENS_TIME_PERIOD_IN_MINUTES || 1440;

class GatedRegistrationsTokensJobs extends CommonJob {
  async execute() {
    const currentDate = new Date();
    const timeFromNow = new Date(currentDate);
    timeFromNow.setMinutes(
      currentDate.getMinutes() - CLEAR_GATED_REGISTRATION_TOKENS_TIME_PERIOD_IN_MINUTES,
    );

    this.postMessage(
      `Processing clear GATED REGISTRATION TOKENS older then - ${timeFromNow}`,
    );

    const rowsDeleted = await GatedRegistrtionTokens.destroy({
      where: { createdAt: { [Sequelize.Op.lt]: timeFromNow } },
      force: true,
    });

    this.postMessage(`Cleared ${rowsDeleted} gated registration tokens`);

    this.finish();
  }
}

new GatedRegistrationsTokensJobs().execute();
